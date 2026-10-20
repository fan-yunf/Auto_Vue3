<template>
  <div class="page-inner">
    <el-tabs
      v-model="activeTab"
      tab-position="left"
      class="full-height-tabs"
    >
      <el-tab-pane label="存款业务" name="1"> <savePC /></el-tab-pane>
      <el-tab-pane label="财政业务" name="2">    
         <el-button type="primary" @click="onlog">生成新文件</el-button>
      </el-tab-pane>
      <el-tab-pane label="公共管理" name="3">角色管理</el-tab-pane>
      <el-tab-pane label="后台交易及接口" name="4">定时任务补偿</el-tab-pane>
      <el-tab-pane label="结算业务" name="5">定时任务补偿</el-tab-pane>
      <el-tab-pane label="卡类业务" name="6">定时任务补偿</el-tab-pane>
      <el-tab-pane label="客户管理" name="7">定时任务补偿</el-tab-pane>
      <el-tab-pane label="特殊业务" name="8">定时任务补偿</el-tab-pane>
      <el-tab-pane label="外汇业务" name="9">定时任务补偿</el-tab-pane>
      <el-tab-pane label="线上渠道" name="10">定时任务补偿</el-tab-pane>
      <el-tab-pane label="信贷业务" name="11">定时任务补偿</el-tab-pane>
      <el-tab-pane label="中间业务" name="12">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import savePC from './reportCom/savePro.vue'
import request from '@/utils/request'
export default {
  components: {
    savePC
  },
    data() {
      return {
        activeTab: '1'  // 默认选中第一个tab
      };
    },
    methods: {
   async onlog() {
      console.log('点击了生成新文件')
      // 在这里写生成文件逻辑，调用接口等
      try {
        // 发起请求
        const res = await request({
          url: '/banksystem/list',
          method: 'GET',
          // 传给后端的参数
          data: {
            tabId: this.activeTab
          }
        })
        console.log('接口返回结果：', res)
        // 在这里处理成功后的逻辑，比如提示、弹窗、跳转
        // ElMessage.success('文件生成成功')
      } catch (err) {
        console.error('请求失败：', err)
        // 失败提示
        // ElMessage.error('生成失败')
      }
    }
  }
};


</script>
<style scoped>
.page-inner {
  width: 100%;
  height: 100%;
}
:deep(.full-height-tabs) {
  height: 100%;
}
:deep(.full-height-tabs .el-tabs__nav-wrap) {
  height: 100%;
}
:deep(.full-height-tabs .el-tabs__content) {
  height: 100%;
  overflow: auto;
}
:deep(.full-height-tabs .el-tab-pane) {
  height: 100%;
}
</style>
