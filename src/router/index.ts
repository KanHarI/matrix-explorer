import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";

const routes: Array<RouteRecordRaw> = [{ path: "/main", component: MainPage }];

export const router = createRouter({
  history: createWebHistory("/"),
  routes,
});
