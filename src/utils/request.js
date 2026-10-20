import axios from 'axios'

// 创建axios实例
const service = axios.create({
  // baseURL：统一基础地址，vite代理的时候这里可以先写/api
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器（发请求之前）
service.interceptors.request.use(
  config => {
    // 可以在这里加token
    // config.headers.Authorization = 'Bearer ' + token
    return config
  },
  err => Promise.reject(err)
)

// 响应拦截器（后端返回之后）
service.interceptors.response.use(
  res => {
    // 直接返回后端data
    return res.data
  },
  err => {
    console.error('接口错误：', err)
    return Promise.reject(err)
  }
)

export default service
