import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";

import { yandexMap } from "vue-yandex-maps";



const app = createApp(App);
app.use(yandexMap, {
    apiKey: "45e4cd39-9c6d-4082-ae42-5440306a2729",
    lang: "ru_RU",
});
app.use(router);
app.mount('#app');


