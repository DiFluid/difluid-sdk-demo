<template>
  
  <view class="tds_box">
        <slot name="head">
            <view class="tds_content">
                <view class="tds_flex" v-for="(item, index) in list" :key="index">
                    <view class="tds_tit">{{ item.title }}</view>
                    <view class="tds_val">
                        <text class="tds_val_placeholder" v-if="item.placeholder">{{ item.placeholder === '' ? '-' : item.placeholder }}</text>
                        {{ item.value === '' ? '-' : item.value }}
                    </view>
                </view>
            </view>
        </slot>
        <slot></slot>
        <!-- <view class="tds_btn_box">
            <view class="tds_btn">ZERO</view>
            <view class="tds_btn">TEST</view>
        </view> -->
    </view>
</template>

<script>
export default {
    props: {
        list: {
            type: [Object, Array],
            default: []
        }
    },
    data () {
        return {
        }
    }
}
</script>

<style scoped>

.tds_content {
    display: flex;
    align-items: center;
    padding: 60rpx 0;
}
.tds_content  .tds_flex{
    flex: 1;
    text-align: center;
}
.tds_flex .tds_tit {
    color: #5ECDBD;
}
.tds_flex view{
    padding: 20rpx;
}
.tds_val_placeholder {
    display: block;
    color: #8F949D;
}
</style>
