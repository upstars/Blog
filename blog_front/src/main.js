/**
 * vue-router
 * axios
 * naive-ui
 * wangEditor
 * sass
 * pinia
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createDiscreteApi } from "naive-ui";
import naive from "naive-ui";
import { createPinia } from "pinia";
import axios from "axios";
import { AdminStore } from "./stores/AdminStore";

const app = createApp(App);

axios.defaults.baseURL = "http://localhost:8888";
//跨域访问
//axios.defaults.baseURL = "/api";

const { message, notification, dialog } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
]);

app.provide("axios", axios);
app.provide("message", message);
app.provide("dialog", dialog);
app.provide("notification", notification);
app.provide("server_url", axios.defaults.baseURL);
app.use(router).use(naive).use(createPinia()).mount("#app");

//后端服务器地址
const adminStore = AdminStore();

//拦截器,在headers中添加token
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token;
  return config;
});
