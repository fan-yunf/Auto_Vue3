// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  server: {proxy: {
      // 匹配 /api 开头的请求
      '/api': {
        target: 'http://124.221.172.47:8082', // 后端地址
        changeOrigin: true, // 开启跨域
        // 路径重写：不需要的话不用写
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }},
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 配置 @ => src
    }
  }
  
})
