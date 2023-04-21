<template>
    <view class="page">
        <view class="nav" :style="{ height: iStatusBarHeight + 'px' }">
            <view class="nav_center">
                R2 Extract
            </view>
        </view>
        <head-data :list="headDataList">
            <view class="tds_btn_box">
                <view class="tds_btn" @click="zero">ZERO</view>
                <view class="tds_btn" @click="test">TEST</view>
            </view>
        </head-data>
        <view class="page_content">
            <dft-group title="INFO" :titleStyle="{ 'color': '#5ECDBD', 'font-size': '28rpx', 'padding-bottom': '20rpx' }">
                <dft-cell title="S/N" :value="this.deviceItem.sn || '-'" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }"></dft-cell>
                <dft-cell title="Version" :value="version" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :borderBottom="false" :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }"></dft-cell>
            </dft-group>
            <dft-group title="SETTINGS"
                :titleStyle="{ 'color': '#5ECDBD', 'font-size': '28rpx', 'padding-bottom': '20rpx' }">
                <dft-cell title="Unit" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }">
                    <view style="display: flex;flex-flow: row-reverse;">
                        <u-subsection style="width: 150rpx;" :list="['˚C', '˚F']" @change="setTemperatureUnit"
                            :current="unit" bgColor="rgba(255,255,255,0.1)" buttonColor="rgba(255,255,255,0.2)"
                            inactiveColor="#fff" activeColor="#fff" fontSize="30"></u-subsection>
                    </view>

                </dft-cell>
                <dft-cell title="Auto Test" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }">
                    <u-switch v-model="autoTest" @change="setAutoTest" activeColor="#5ECDBD"
                        inactiveColor="rgba(255,255,255,.3)"></u-switch>
                </dft-cell>
                <dft-cell title="Average Test Time" bgColor="#0C1224" hoverClass="none" :arrow="false"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }">
                    <u-number-box integer :min="1" :max="10" :value="testCount" @change="setTestCount"
                        bgColor="rgba(255,255,255,.15)" color="#ffffff"></u-number-box>
                </dft-cell>
                <dft-cell title="Screen Brightness" bgColor="#0C1224" :borderBottom="false" hoverClass="none"
                    :value="screenBrightness" :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }"></dft-cell>
                <view style="padding: 60rpx;background: #0C1224;">
                    <u-slider min="30" v-model="screenBrightness" @end="setScreenBrightness"></u-slider>
                </view>
            </dft-group>
        </view>
    </view>
</template>

<script>
import headData from '@/components/head-data'
import dftGroup from "uview-ui/components/u-cell-group/u-cell-group.vue";
import dftCell from "uview-ui/components/u-cell-item/u-cell-item.vue";
import { handlerPromise, ab2hex } from '@/utils/common.js'
import {
    notifyBLECharacteristicValueChange,
    onBLECharacteristicValueChange
} from '@/utils/bluetooth.js'
import {
    writeToDevice
} from '@/utils/device.js'
import { toast } from "@/utils/dialog"
import config from '@/config.js'
import { sendData } from "@/utils/bytesData"
import { processData } from './data'

export default {
    components: {
        headData,
        dftGroup,
        dftCell
    },
    data() {
        return {
            iStatusBarHeight: 0,
            headDataList: [
                {
                    title: 'Refractive Index',
                    value: ''
                }, {
                    title: 'TDS',
                    value: ''
                }, {
                    title: 'Temperature',
                    value: '',
                    placeholder: ''
                }
            ],

            deviceId: '',
            serviceId: '',
            charID0: '', // cleartext data channel
            service: '',
            charID1: '', // encrypted data channel

            instructState: '',
            deviceItem: {},
            version: '', // firmware version

            isInit: true, // Initialization status

            // Device Status
            unit: 0,
            autoTest: false,
            testCount: 1,
            screenBrightness: 100,

            // license (Replace this with your own license)
            license: 'b0b978c8d7fe4ac782767996f34a6ce1',
        };
    },
    onLoad(action) {
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
        this.deviceId = action.deviceId
        this.serviceId = action.serviceId
        this.charID0 = action.charID0
        this.charID1 = action.charID1
        this.service = action.service

        this.listenCharacteristic()
    },
    methods: {
        // -------------------------------------------listen to the encrypted channel-------------------------------------------
        // ps: Uniapp framework only supports listen on one bluetooth main service at a time, so we have to switch between the two channels
        async listenCharacteristic() {
            notifyBLECharacteristicValueChange(
                this.deviceId,
                this.serviceId,
                this.charID0,
                () => {
                    onBLECharacteristicValueChange(this.handCharacteristicValueChange);
                    setTimeout(() => {
                        this.createSnAndMac()
                    }, 1000)
                }
            )
        },

        // the callback function of the encrypted channel
        async handCharacteristicValueChange(res) {
            console.log("Characteristic Value Change", res);

            console.log("instructState = ", this.instructState);

            // if the cleartext channel is enabled, switch to listen the cleartext channel
            if (this.instructState === 'enableCleartext') {

                notifyBLECharacteristicValueChange(
                    this.deviceId,
                    this.serviceId,
                    this.charID1,
                    () => {
                        onBLECharacteristicValueChange(this.handCharacteristicValueChangeClear);
                        this.instructState = ''
                        this.getFirmwareVersion()
                    }
                )
            } else if (this.instructState !== '') {

                // process the data returned by the device, and then send the next instruction
                this.attestation(ab2hex(res.value))
            }
        },

        // -------------------------------------------Communicate with DiFluid Server-------------------------------------------
        async createSnAndMac() {
            // Step0: Request for 'cmd1' from server
            const [err, res] = await this.cmdRequest('cmd1');

            if (err) {
                toast(err);
                return;
            }

            // Step1: Write cmd1 to device
            const writeData = {
                value: res,
                serviceId: this.serviceId,
                deviceId: this.deviceId,
                characteristicId: this.charID0,
            };
            console.log("Writing cmd1 to device...", writeData)
            this.instructState = 'cmd1'
            setTimeout(() => {
                writeToDevice(writeData)
            }, 200);
        },

        // -------------------------------------------pass the message between server and device-------------------------------------------

        async attestation(data) {

            //Step2-3: Get dev_cmd1 respond from device, send dev_cmd1 respond to server
            //Step7-8: Get dev_cmd2 respond from device, send dev_cmd2 respond to server
            //Step11-12: Get dev_cmd3 respond from device, send dev_cmd3 respond to server
            let [error, item] = await this.devRespond(data)

            if (error) {
                console.warn(error)
                return
            }
            console.warn('start' + this.instructState)

            if (this.instructState === 'cmd1') {
                // Step4: Get respond of SN & MAC from server
                console.warn(item)
                this.deviceItem = {
                    sn: item.sn || '',
                    mac: item.mac || ''
                }
                // Step5: Request for 'cmd2' from server
                let [err, res] = await this.cmdRequest('cmd2', {
                    ...this.deviceItem
                })
                if (err) {
                    console.error(err)
                    return
                }
                console.warn(res)

                // Step6: Write 'cmd2' to device
                const writeData = {
                    value: res,
                    serviceId: this.serviceId,
                    deviceId: this.deviceId,
                    characteristicId: this.charID0,
                };
                console.log("Writing cmd2 to device...", writeData)
                this.instructState = 'cmd2'
                setTimeout(() => {
                    writeToDevice(writeData)
                }, 200);

            } else if (this.instructState === 'cmd2') {
                // Step9: Get cmd3 from server
                // ps: cmd3 is in the respond: item.instructContent
                console.warn(item)

                // Step10: write cmd3 to device
                const writeData = {
                    value: item.instructContent,
                    serviceId: this.serviceId,
                    deviceId: this.deviceId,
                    characteristicId: this.charID0,
                };
                console.log("Writing cmd3 to device...", writeData)
                this.instructState = 'cmd3'
                setTimeout(() => {
                    writeToDevice(writeData)
                }, 200);
            } else if (this.instructState === 'cmd3') {
                if (item != "00") {
                    toast('Device initialization failed')
                    // TODO: stop bluetooth connection, back to the device list page
                }

                // Step13: Request for 'enableCleartext' cmd from server
                let [err, res] = await this.cmdRequest('enableCleartext', {
                    ...this.deviceItem
                })
                if (err) {
                    console.warn(err)
                    return
                }

                // Step14: Write 'enableCleartext' cmd to device
                const writeData = {
                    value: res,
                    serviceId: this.serviceId,
                    deviceId: this.deviceId,
                    characteristicId: this.charID0,
                };
                console.log("Writing cmd to device...", writeData)
                this.instructState = 'enableCleartext'
                setTimeout(() => {
                    writeToDevice(writeData)
                }, 200);
            }
        },

        // -------------------------------------------data handler for cleartext channel-------------------------------------------

        async handCharacteristicValueChangeClear(res) {
            let data = ab2hex(res.value)
            console.log("characteristic value changed on cleartext channel:", data);
            let obj = processData(data)
            if (!obj) {
                console.warn('data error')
                return
            }
            console.log("characteristic value changed on cleartext channel (obj) = ", obj);
            console.log(obj.func === 0 && obj.cmd === 2)

            if (obj.func === 0 && obj.cmd === 2) {
                console.log('firmware version', obj.data)
                this.version = obj.data
                if (this.isInit) {
                    this.getTemperatureUnit()
                }
            } else if (obj.func === 1 && obj.cmd === 0) {
                console.log('temperature unit', obj.data)
                this.unit = obj.data
                if (this.isInit) {
                    this.getAutoTest()
                }
            } else if (obj.func === 1 && obj.cmd === 1) {
                console.log('auto test', obj.data)
                this.autoTest = obj.data === 1
                if (this.isInit) {
                    this.getScreenBrightness()
                }
            } else if (obj.func === 1 && obj.cmd === 2) {
                console.log('screen brightness', obj.data)
                this.screenBrightness = obj.data
                if (this.isInit) {
                    this.getTestCount()
                }
            } else if (obj.func === 1 && obj.cmd === 3) {
                console.log('number of tests', obj.data)
                this.testCount = obj.data
                if (this.isInit) {
                    this.isInit = false
                }
            } else if ((obj.func === 3 && obj.cmd === 0) || (obj.func === 3 && obj.cmd === 1) || (obj.func === 3 && obj.cmd === 2)) {
                console.log('test result', obj.data)
                if (obj.data.count === '01') {
                    this.$set(this.headDataList, 2, {
                        ...this.headDataList[2],
                        value: obj.data.temp,
                        placeholder: obj.data.caliTemp
                    })
                } else if (obj.data.count === '02') {
                    this.$set(this.headDataList, 0, {
                        ...this.headDataList[0],
                        value: obj.data.refractiveIndex
                    })
                    this.$set(this.headDataList, 1, {
                        ...this.headDataList[1],
                        value: obj.data.concentration + '%'
                    })
                }
            }
        },

        // get SN
        getSN() {
            this.send(sendData('00', '00', '00', ''), this.charID1)
        },
        // get Product Model 
        // 
        getProductModel() {
            this.send(sendData('00', '01', '00', ''), this.charID1)
        },
        // 获取版本号
        getFirmwareVersion() {
            this.send(sendData('00', '02', '00', ''), this.charID1)
        },

        // Settings
        // Temperature Unit
        getTemperatureUnit() {
            this.send(sendData('01', '00', '00', ''), this.charID1)
        },
        setTemperatureUnit(value) {
            this.send(sendData('01', '00', '01', this.numberToHex(value)), this.charID1)
        },
        // Auto Test
        getAutoTest() {
            this.send(sendData('01', '01', '00', ''), this.charID1)
        },
        setAutoTest(value) {
            value = value ? 1 : 0
            console.warn('value', this.numberToHex(value))
            this.send(sendData('01', '01', '01', this.numberToHex(value)), this.charID1)
        },
        // Screen Brightness
        getScreenBrightness() {
            this.send(sendData('01', '02', '00', ''), this.charID1)
        },
        setScreenBrightness() {
            console.log('设置屏幕亮度', this.screenBrightness)
            this.send(sendData('01', '02', '01', this.numberToHex(this.screenBrightness)), this.charID1)
        },
        // Number of Tests
        getTestCount() {
            this.send(sendData('01', '03', '00', ''), this.charID1)
        },
        setTestCount(value) {
            this.send(sendData('01', '03', '01', this.numberToHex(value.value)), this.charID1)
        },

        // Actions
        // Test
        test() {
            if (this.autoTest) {
                this.averageTest()
            } else {
                this.send(sendData('03', '00', '00', ''), this.charID1)
            }
        },
        // Average Test
        averageTest() {
            this.send(sendData('03', '01', '01', this.numberToHex(this.testCount)), this.charID1)
        },
        // Calibration
        zero() {
            this.send(sendData('03', '02', '00', ''), this.charID1)
        },

        // -------------------------------------------command for server communication-------------------------------------------

        // Customize request header (wrap the license into header & request for specific instructions cmd from server)
        async cmdRequest(type, data = {}) {
            console.warn('cmdRequest', {
                model: 'DFT-R102',
                type: type,
                ...data
            })
            return handlerPromise(
                new Promise((resolve, reject) => {
                    uni.request({
                        url: config.HTTP_REQUEST_URL + '/sdk/cmdRequest',
                        method: 'POST',
                        data: {
                            model: 'DFT-R102',
                            type: type,
                            ...data
                        },
                        header: {
                            'Content-Type': 'application/json',
                            'license': config.LICENSE_KEY
                        },
                        success: (res) => {
                            console.log('Server respond', res)
                            resolve(res.data.data)
                        },
                        fail: (err) => {
                            console.log('Failed Request', err)
                            reject("request failed...")
                        }
                    });

                })
            )
        },

        // Send the data received from the device to the server
        async devRespond(content) {
            console.log('send devRespond', {
                model: 'DFT-R102',
                content: content,
                sn: this.deviceItem.sn || '',
                mac: this.deviceItem.mac || ''
            })
            return handlerPromise(
                new Promise((resolve, reject) => {
                    uni.request({
                        url: config.HTTP_REQUEST_URL + '/sdk/devRespond',
                        method: 'POST',
                        data: {
                            model: 'DFT-R102',
                            content: content,
                            sn: this.deviceItem.sn || '',
                            mac: this.deviceItem.mac || ''
                        },
                        header: {
                            'Content-Type': 'application/json',
                            'license': config.LICENSE_KEY
                        },
                        success: (res) => {
                            console.log('Server respond', res)
                            resolve(res.data.data)
                        },
                        fail: (err) => {
                            console.log('Failed Request', err)
                            reject("request failed...")
                        }
                    });

                })
            )
        },

        // ----------------- General Methods -----------------
        // send cmd (assemble data package)
        send(value, characteristicId) {
            const writeData = {
                value: value,
                serviceId: this.serviceId,
                deviceId: this.deviceId,
                characteristicId: characteristicId,
            };
            console.log("开始下发指令。。。", writeData)
            setTimeout(() => {
                writeToDevice(writeData)
            }, 200);
        },

        // number to hex
        numberToHex(num) {
            let hex = num.toString(16)
            if (hex.length % 2 !== 0) {
                hex = '0' + hex
            }
            return hex
        },

        arrayBufferToHex(arrayBuffer) {
            const byteArray = new Uint8Array(arrayBuffer);
            const hexStringArray = [];
            byteArray.forEach(byte => {
                const hex = byte.toString(16).padStart(2, '0');
                hexStringArray.push(hex);
            });
            return hexStringArray.join('');
        },
    }
};
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-flow: column;
    height: 100vh;
    overflow: hidden;
}

.nav_center {
    flex: 1;
    font-size: 40rpx;
}

.nav {
    min-height: 44px;
    text-align: center;
    display: flex;
    align-items: center;
}

.page_content {
    flex: 1;
    width: 100%;
    overflow-y: auto;
}

.tds_btn_box {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: center;
    justify-content: space-evenly;
    padding: 60rpx 0;
}

.tds_btn {
    padding: 10rpx 60rpx;
    border: 1px solid #5ECDBD;
    background: rgba(17, 29, 50, 1);
    font-size: 24rpx;
}

/deep/ .u-border-top:after {
    border: 1px solid #333747;
}

/deep/ .u-border-bottom:after {
    border: 0px solid #333747;
    border-bottom-width: 1px;
}

/deep/ .u-cell {
    padding: 35rpx;
}

/deep/ .u-switch__node {
    background: #0C1224;
    width: 35rpx !important;
    height: 35rpx !important;
    margin: 8rpx;
}

/deep/ .u-switch--on .u-switch__node {
    transform: translateX(150%);
}

/deep/ .u-icon-disabled {
    background: rgba(17, 29, 50, 1) !important;
    // border: 1px solid rgba(17, 29, 50, 1) !important; 
}

// /deep/ .u-icon-plus,
// /deep/ .u-icon-minus,
// /deep/ .u-number-input {
//     border: 1px solid #5ECDBD; 
// }
</style>