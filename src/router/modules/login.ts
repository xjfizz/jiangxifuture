// import login from "@/page/login/login.vue";

export default {
    path: "/login",
    name: 'login',
    component: () => import('@/page/login/login.vue'),
};
