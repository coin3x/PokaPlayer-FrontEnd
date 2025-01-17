import Vue from "vue";
import VueI18n from "vue-i18n";

let langList = {
  zh_CN: require("./zh-CN/index.js").default,
  zh_TW: require("./zh-TW/index.js").default,
  en_US: require("./en-US/index.js").default
};

Vue.use(VueI18n);
const locale = window._setting("lang");
const messages = langList;

const i18n = new VueI18n({
  /** 默認值 */
  locale,
  fallbackLocale: "en_US",
  messages,
  missing: (locale, key, vm) => key
});
window.i18n = i18n;
// Hot updates
if (module.hot) {
  module.hot.accept(["./zh-CN/index.js", "./zh-TW/index.js", "./en-US/index.js"], function () {
    i18n.setLocaleMessage("zh_CN", require("./zh-CN/index.js").default);
    i18n.setLocaleMessage("en_US", require("./en-US/index.js").default);
    i18n.setLocaleMessage("zh_TW", require("./zh-TW/index.js").default);
  });
}
export default i18n;
