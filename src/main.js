// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "@/assets/poka.js";

import Vue from "vue";
import App from "./App";
import router from "./router";
import i18n from "./lang";
import "./registerServiceWorker";

import PortalVue from "portal-vue";
Vue.use(PortalVue);

import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

import * as PokaComponents from "./poka-component";
Object.values(PokaComponents).forEach(x => Vue.component(x.name, x));

import vuetify from "./plugins/vuetify";

// 偵測暗黑模式
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
themeSwitch(darkModeMediaQuery.matches);
darkModeMediaQuery.addListener(e => {
  const darkModeOn = e.matches;
  themeSwitch(darkModeOn);
});

function themeSwitch(dark = false) {
  vuetify.framework.theme.isDark = dark;
}

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  i18n,
  components: {
    App
  },
  template: "<App/>",
  vuetify,
  render: h => h(App)
});
