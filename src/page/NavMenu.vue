<template>
  <el-menu
    mode="horizontal"
    v-model="activeIndex"
    @select="handleSelect"
    class="el-menu-demo"
  >
    <!-- 普通一级菜单 -->
    <el-menu-item index="/">案例生成</el-menu-item>

    <!-- 带子菜单：银行业务 -->
    <el-sub-menu index="/report">
      <template #title>银行业务</template>
      <el-menu-item index="/report/Reportcounter">柜面系统</el-menu-item>
      <el-menu-item index="/report/deposit">核心系统</el-menu-item>
      <el-menu-item index="/report/account">信贷系统</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/skill">案例技巧</el-menu-item>

    <!-- AI 也加子菜单示例 -->
    <el-sub-menu index="/ai">
      <template #title>AI</template>
      <el-menu-item index="/ai/chat">智能对话</el-menu-item>
      <el-menu-item index="/ai/image">AI绘图</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import router from '../router'

export default {
    
  data() {
    return {
      activeIndex: '/'
    }
  },
  mounted() {
    this.syncMenuByRoute()
  },
  watch: {
    '$route'() {
      this.syncMenuByRoute()
    }
  },
  methods: {
    syncMenuByRoute() {
      if (!this.$route) return
      this.activeIndex = this.$route.path
    },
    handleSelect(index) {
      // index 就是子菜单的path，直接跳转
      router.push(index)
    }
  }
}
</script>
