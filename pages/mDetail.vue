<template>
    <view class="page">
        <view class="nav" :style="{ height: iStatusBarHeight + 'px' }">
            <view class="nav_center">
                Microbalance
            </view>
        </view>
        <head-data :list="headDataList">
            <view class="head_btn_box">
                <view class="head_btn">TARE</view>
                <view class="head_icon">
                    <!-- play-right-fill pause -->
                    <u-icon name="play-right-fill" color="#0C1224" size="50"></u-icon>
                    <!-- <u-icon name="pause" color="#0C1224" size="50"></u-icon> -->
                </view>
                <view class="head_btn">RESET</view>
            </view>
        </head-data>
        <view class="page_content">
            <dft-group title="INFO" :titleStyle="{ 'color': '#5ECDBD', 'font-size': '28rpx', 'padding-bottom': '20rpx' }">
                <dft-cell title="S/N" value="903845309825903" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }"></dft-cell>
                <dft-cell title="Version" value="V102" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :borderBottom="false" :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }"></dft-cell>
            </dft-group>
            <dft-group title="SETTINGS" :titleStyle="{ 'color': '#5ECDBD', 'font-size': '28rpx', 'padding-bottom': '20rpx' }">
                <dft-cell title="Unit" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }">
                    <view style="display: flex;flex-flow: row-reverse;">
                        <u-subsection style="width: 180rpx;" :list="['g', 'oz', 'gr']" :current="0"
                            bgColor="rgba(255,255,255,0.1)" buttonColor="rgba(255,255,255,0.2)" inactiveColor="#fff"
                            activeColor="#fff" fontSize="30"></u-subsection>
                    </view>

                </dft-cell>
                <dft-cell title="Auto-Detect Timing" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }">
                    <u-switch v-model="autoDetectTiming" activeColor="#5ECDBD"
                        inactiveColor="rgba(255,255,255,.3)"></u-switch>
                </dft-cell>
                <dft-cell title="Auto-Stop Timing" :arrow="false" hoverClass="none" bgColor="#0C1224"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }">
                    <u-switch v-model="autoStopTiming" activeColor="#5ECDBD"
                        inactiveColor="rgba(255,255,255,.3)"></u-switch>
                </dft-cell>
                <dft-cell title="Beep Sound" bgColor="#0C1224" :borderBottom="false" hoverClass="none"
                    :titleStyle="{ 'color': '#fff', 'font-size': '30rpx' }"
                    :valueStyle="{ 'color': '#8F949D', 'font-size': '30rpx' }" @click="() => { show = true }"></dft-cell>
            </dft-group>
        </view>
    </view>
</template>

<script>
import headData from '@/components/head-data'
import dftGroup from "uview-ui/components/u-cell-group/u-cell-group.vue";
import dftCell from "uview-ui/components/u-cell-item/u-cell-item.vue";
import dftPopup from "uview-ui/components/u-popup/u-popup.vue";
export default {
    components: {
        headData,
        dftGroup,
        dftCell,
        dftPopup
    },
    data() {
        return {
            iStatusBarHeight: 0,
            autoDetectTiming: false,
            autoStopTiming: false,
            headDataList: [
                {
                    title: 'Time',
                    value: '20:20'
                }, {
                    title: 'Flow Rate',
                    value: '12.3 g/s'
                }, {
                    title: 'Weight',
                    value: '1222.2 g'
                }
            ],
            show: false
        };
    },
    onLoad() {
        this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    },
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

.head_btn_box {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: center;
    justify-content: space-evenly;
    padding: 60rpx 0;
}

.head_btn {
    padding: 10rpx 60rpx;
    border: 1px solid #5ECDBD;
    background: rgba(17, 29, 50, 1);
    font-size: 24rpx;
}

.head_icon {
    width: 120rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    text-align: center;
    border-radius: 100%;
    background: #fff;
    flex-wrap: nowrap;
    justify-content: center;
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