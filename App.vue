<script>
	export default {
		onLaunch: function() {
			console.log('>>>>>>>>>>>>>>>starting<<<<<<<<<<<<<<')
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss" src="./assets/common.scss"></style>
<style lang="scss">
	@import "uview-ui/index.scss";

	page {
		background: #09152A;
		color: #fff;
		font-size: 28rpx;
		height: 100%;
		min-height: 100%;
	}

	view,
	navigator,
	image,
	text,
	scroll-view,
	swiper,
	swiper-item,
	input,
	textarea,
	button {
		box-sizing: border-box;
	}

	/* 文字避头尾法则 */
	.btw {
		table-layout: fixed;
		word-wrap: break-word;
		word-break: normal;
		text-align: justify;
		text-justify: inter-ideograph;
	}

	.bg-white {
		background: #fff;
	}

	.font-weight {
		font-weight: bold;
	}
</style>
