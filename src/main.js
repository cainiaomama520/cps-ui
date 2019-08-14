import Vue from 'vue'
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/common.css';
import api from './utils/request.js';
import wbobj from './utils/wbobj.js';
import App from './App'
import router from './router'
// 将API方法绑定到全局
Vue.prototype.$api = api

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(wbobj);

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
