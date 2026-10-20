import { createApp } from 'vue'
import App from './App.vue'
// 导入路由
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
// 关键！注册vue-router，不写这个router-view失效
app.use(router)
app.use(ElementPlus)
app.mount('#app')
