import Vue from 'vue'
import App from './App'
import config from '@/config.js'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$ossDomain = config.OSS_DOMAIN;

// 引入uView
import uView from 'uview-ui'
Vue.use(uView);

// #ifndef H5
// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);
// #endif

const app = new Vue({
	...App
})

app.$mount()
