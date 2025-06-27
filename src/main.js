import './assets/main.css';
import './assets/css/global.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'chart.js';

const pinia = createPinia();
const app = createApp(App);
app.use(router).use(pinia).mount('#app');