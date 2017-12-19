// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//引用第三方ajax插件axios
import axios from 'axios'
Vue.prototype.$http = axios
//使用第三方的类库对请求进行格式化
import qs from 'qs';
axios.interceptors.request.use( (config) => {
    if (config.method=="post"){
        config.data = qs.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
},  (error) => {
    return Promise.reject(error);
});


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
