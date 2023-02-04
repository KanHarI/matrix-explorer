import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// @ts-ignore
import VueMathjax from "vue-mathjax-next";

const app = createApp(App);
app.use(VueMathjax);
app.mount("#app");
