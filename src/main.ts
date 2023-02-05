import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// @ts-ignore
import VueMathjax from "vue-mathjax-next";
import { router } from "./router";

const app = createApp(App);
app.use(VueMathjax);
app.use(router);
app.mount("#app");
