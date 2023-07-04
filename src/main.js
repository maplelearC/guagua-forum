import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/style/common.css'
import '@/style/bootstrap.min.css'
// import '@/style/jquery-3.3.1.min.js'
// import '@/style/popper.min.js'
// import '@/style/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

import 'bootstrap/dist/js/bootstrap.min'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
import Header from "@/components/Header";
import Footer from "@/components/Footer"
import Pagination from "@/components/Pagination"
import pmd from '@/components/Carousel.vue'

const app = createApp(App);

app.component("Header", Header)
app.component("Footer", Footer)
app.component("Pagination", Pagination)
app.component("pmd", pmd)

app.use(store);
app.use(router);
app.use(ElementUI)

app.mount("#app");

