import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    // { path: '/', component: () => import('@/views/Home.vue') },
    // { path: '/user/:id', component: () => import('@/views/User.vue') },
];


export default createRouter({
    history: createWebHistory(),
    routes,
});

