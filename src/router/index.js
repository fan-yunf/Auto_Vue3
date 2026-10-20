import { createRouter, createWebHistory } from 'vue-router'

// 页面组件（只有页面，导航NavMenu不要写在这里！）
const Home = () => import('@/components/Home.vue')
const Reportcounter = () => import('@/page/report/reportcounter.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/report/Reportcounter',
    name: 'report',
    component: Reportcounter
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 调试日志
router.beforeEach((to, from, next) => {
  console.log('跳转路由', to.path, to.matched)
  next()
})

export default router
