import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: LoginView,
  },
  {
    path: "/app",
    name: "app",
    component: HomeView,
    beforeEnter: (to) => {
      const token = localStorage.getItem("token");
      if (token) {
        return true;
      } else {
        router.push("/");
      }
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    beforeEnter: (to) => {
      const role = localStorage.getItem("role");
      if (role == 2) {
        return true;
      } else {
        router.push("/app");
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
