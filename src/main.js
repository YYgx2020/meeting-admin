/* 
  初始化vue实例，并引入所需插件
*/

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import axios from "axios";
import store from "./store";
import dayjs from 'dayjs';

import "element-ui/lib/theme-chalk/index.css";

Vue.prototype.dayjs = dayjs;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios; // 将axios绑定到vue的原型上

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
  store,
}).$mount("#app");
