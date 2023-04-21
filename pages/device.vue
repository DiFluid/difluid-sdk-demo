<template>
	<view class="content">
		<view class="device">
			<view class="device-box device-select">
				<view class="device-img" @click="startConnection('r2')">
					<image src="../static/extract.png" />
				</view>
				<view class="device_text">R2 Extract</view>
			</view>
			<!-- <view class="device-box">
				<view class="device-img" @click="startConnection('m')">
					<image src="../static/microbalance.png" />
				</view>
				<view class="device_text">Microbalance</view>
			</view> -->
		</view>
	</view>
</template>

<script>

import {
	initBluetooth,
	startBluetoothDevicesDiscovery,
	stopBluetoothDevicesDiscovery,
	createBLEConnection,
	getServices,
	getBLEDeviceCharacteristics,
	setBLEMTU,
} from '@/utils/bluetooth.js'
import { toast } from "@/utils/dialog"

export default {
	data() {
		return {
			currDevice: {},
			devices: [],
			deviceIds: [],

			inScan: false,
			isInit: false,
			inConnection: false,

			deviceId: '',
			serviceId: '',
			service: '',
			clickDevice: '',
			serviceMap: {
				r2: '00FF',
				m: '00EE'
			},
			charIDs: []
			// charIDs[0]: The charateristic ID of encrypted transmission
			// charIDs[1]: The charateristic ID of cleartext transmission
		};
	},
	methods: {

		// Step1: Call openBluetoothAdapter() to start the connection process and set the target device
		startConnection(type) {
			this.clickDevice = type
			this.openBluetoothAdapter()
		},

		// Step2: Bluetooth initialization
		async openBluetoothAdapter() {  // Initialize Bluetooth adapter to begin scanning for devices
			if (this.isInit) {   // Check if Bluetooth is already initialized
				this.scan()  // Scan for devices
				setTimeout(() => {  // Stop scan after 5 seconds
					this.stopScan()
				}, 5000)
				return
			}

			uni.showLoading({  // Display loading indicator while initializing Bluetooth
				title: 'initializing Bluetooth...'
			})
			const [error, res] = await initBluetooth()  // Initialize Bluetooth
			uni.hideLoading()  // Hide loading indicator

			if (error) {  // Check if an error occurred while initializing Bluetooth
				toast(error)
			} else {          // If no error occurred
				this.isInit = true  // Set isInit flag
				toast("Bluetooth initialized successfully");  // Display success message
				this.scan()  // Begin scanning for devices
				setTimeout(() => {  // Stop scan after 5 seconds
					this.stopScan()
				}, 5000)
			}
		},

		// Step3: Begin scan for nearby Bluetooth devices
		scan() {
			const that = this
			that.deviceIds = []  // Initialize array for device IDs
			that.devices = []    // Initialize array for devices
			that.inScan = true  // Set in scan flag
			console.log("start scanning....");
			startBluetoothDevicesDiscovery(function (devices) {  // Start the discovery process
				console.log("devices found, number of devices", devices.length)
				console.log("devices list", devices)
				for (let i = 0; i < devices.length; i++) {  // Loop through each discovered device
					console.log("that.deviceIds.length=", that.deviceIds.length)
					console.log("that.deviceIds.indexOf=", that.deviceIds.indexOf(devices[i].deviceId))
					if (that.deviceIds.length == 0 || that.deviceIds.indexOf(devices[i].deviceId) == -1) {  // Check if device ID is unique
						that.deviceIds.push(devices[i].deviceId);  // Add device ID to the deviceIds array
						that.devices.push({  // Add device to the devices array
							...devices[i],
							mtu: 512
						});
					}
				}
			}, function () {  // Stop scan after completion
				that.inScan = false
			})
			console.log('devices', that.devices)
		},

		// Step4: Stop the scan process
		async stopScan() {
			const [error, res] = await stopBluetoothDevicesDiscovery();  // Stop device discovery process
			console.log("error", error, "res", res)
			if (error) {  // Check if an error occurs
				if (error.errMsg) {
					toast(error.errMsg)
				} else {
					toast(error)
				}
			} else {  // If no error occurs
				this.inScan = false;  // Set the inScan flag
				let targetDevice = {}  // Initialize variable
				this.devices.forEach(item => {  // Loop through each device in the scanned devices array
					if (item.service === this.serviceMap[this.clickDevice]) {  // Check if the service of the device corresponds to the clicked device
						targetDevice = item  // Set the connected device
					}
				})
				this.devices = []  // Clear devices from the device array
				this.connect(targetDevice)  // Connect to the nearby device
			}
		},

		// Step5: Connect to a Bluetooth device
		async connect(device) {
			const that = this;
			const [error, res] = await createBLEConnection(device);  // Create a connection to the Bluetooth Device
			if (error) {
				toast(error.errMsg);
			} else {
				console.log(`device ${device.name} connected`);
				that.currDevice = device;  // Set current device to the connected device
				setTimeout(() => {
					// 设置mtu
					console.log("conn_device=", device)
					that.setMTU(device);  // Set MTU

				}, 2000)
			}
		},

		// Step6: set maximum transmission unit
		async setMTU(device) {
			const [err, res] = await setBLEMTU(device);
			console.log("setMTU,err,res", err, res)
			if (err) {
				console.log("set MTU failed, retrying...")
				device.mtu = device.mtu - 32;
				this.setMTU(device);
			} else {
				console.log("set MTU success");
				toast('set MTU success');

				this.getServices(device)  // Get services associated with the connected device
			}
		},

		// Step7: Get services associated with a connected device
		async getServices(device) {
			const [err, res] = await getServices(device.deviceId);  // Get services associated with the connected device
			if (err) {
				console.error('getServices err', err)
				toast(err.errMsg);
			} else {
				console.log('getServices res', res)
				let serviceId = res.services[res.services.length - 1].uuid;  // Get the uuid of the last service
				device.serviceId = serviceId;  // Save the uuid of the last service
				console.log(`Device: [${device.name}], Service ID: [${serviceId}]`);  // Log the uuid of the last service

				const [error, item] = await getBLEDeviceCharacteristics(  // Get characteristics of the device
					device.deviceId,
					device.serviceId
				);

				if (error) {
					console.error('getBLEDeviceCharacteristics err', err)
					toast(error.errMsg);
				} else {
					console.log(`Device [${device.name}], characteristic ID: [${item.uuid}]`);  // Log the characteristic id
					this.charIDs = item.list  // Save the charIDs
					console.log(`charIDs ${JSON.stringify(this.charIDs)}`);

					this.inConnection = true  // Set in connection flag
					this.deviceId = device.deviceId  // Save the device ID
					this.serviceId = device.serviceId  // Save the service ID
					this.enterDeviceDetail()  // Navigate to the device detail page
				}
			}
		},

		// Step8: navigate to device detail page
		enterDeviceDetail() {
			if (this.clickDevice === 'r2') {
				uni.navigateTo({
					url: 'r2Detail?deviceId=' + this.deviceId + '&serviceId=' + this.serviceId + '&charID1=' + this.charIDs[1].uuid + '&service=' + this.service + '&charID0=' + this.charIDs[0].uuid,
					fail: (res) => {
						console.log(res)
					}
				})
			} else {
				uni.navigateTo({
					url: 'mDetail?deviceId=' + this.deviceId + '&serviceId=' + this.serviceId + '&charID1=' + this.charIDs[1].uuid + '&service=' + this.service + '&charID0=' + this.charIDs[0].uuid,
					fail: (res) => {
						console.log(res)
					}
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.content {
	padding-top: 45%;
}

.device {
	display: flex;
	text-align: center;
	width: 100%;
}

.device-box {
	flex: 1;
}

.device-img {
	padding: 5%;
	background: rgba(17, 29, 50, 1);
	width: min-content;
	margin: 0 auto;
	border: 1px solid rgba(141, 141, 141, 0.24);
}

.device-img image {
	filter: opacity(0.3);
	width: 220rpx;
	height: 220rpx;
}

.device_text {
	padding: 5%;
}

.device-select .device-img {
	border: 1px solid #5ECDBD;
}

.device-select .device-img img {
	filter: opacity(1);
}
</style>
