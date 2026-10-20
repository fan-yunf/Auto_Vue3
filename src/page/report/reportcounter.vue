<template>
  <div class="page-inner">
    <el-tabs
      v-model="activeTab"
      tab-position="left"
      class="full-height-tabs"
    >
      <el-tab-pane label="存款业务" name="1"> <savePC /></el-tab-pane>
      <el-tab-pane label="财政业务" name="2">配置管理</el-tab-pane>
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
export default {
  components: {
    savePC
  },
    data() {
      return {
        activeTab: '1'  // 默认选中第一个tab
      };
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
