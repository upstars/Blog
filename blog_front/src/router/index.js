import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("../views/dashboard/Dashboard.vue"),
    children: [
      {
        path: "/dashboard/category",
        component: () => import("../views/dashboard/Category.vue"),
      },
      {
        path: "/dashboard/article",
        component: () => import("../views/dashboard/Article.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/detail",
    component: () => import("../views/Detail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
