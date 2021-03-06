import Vue from 'vue'
import 'babel-polyfill'

// axios config
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080/api/'
axios.defaults.withCredentials=true
axios.interceptors.response.use(
    response => response,
    error => {
        if(error.response.status == 403 || error.response.status == 404) { 
            console.log("got 403/404 error, require login");
        }
    })
if(localStorage.getItem("JWT") !== undefined) {
    axios.defaults.headers.common["Authorization"] = 
        "Bearer " + localStorage.getItem("JWT")
}
Vue.prototype.$axios = axios;

// Vuex config
import Vuex from 'vuex'
import storeContent from './store'
Vue.use(Vuex)
const store = new Vuex.Store(storeContent)

// router config
import VueRouter from 'vue-router'
import routes from './router'
Vue.use(VueRouter)
const router = new VueRouter({
    mode: "history",
    routes
})
router.beforeEach((to, from, next) => {
    if(to.meta.title) {
        document.title = to.meta.title + " - Ebook图书集市"
    }
    next()
})

// vuetify framework
import Vuetify from 'vuetify'
import UploadButton from 'vuetify-upload-button'
import 'vuetify/dist/vuetify.min.css'
import waterfall from 'vue-waterfall2'
Vue.use(Vuetify, {
    iconfont: 'fa',
    // theme: {
    //     primary: '#03a9f4',
    //     secondary: '#00bcd4',
    //     accent: '#ffc107',
    //     error: '#ff5722',
    //     warning: '#ff9800',
    //     info: '#607d8b',
    //     success: '#4caf50'
    // }
})
Vue.use(waterfall)
Vue.use(UploadButton)
Vue.config.productionTip = false

// Echart
import ECharts from 'vue-echarts'

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
Vue.component('v-chart', ECharts)

import App from './App.vue'
new Vue({
    el: '#app',
    render: h => h(App),
    router: router,
    store
})
