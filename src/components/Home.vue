<template>
  <div>
    <el-upload action="#" :before-upload="handleBeforeUpload">
      <el-button type="primary">
        选择xlsx文件
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </el-upload>
    <el-button type="primary" @click="Creat_NewFile">主要按钮</el-button>
    
    <h3>解析出来的数据</h3>
    <pre>{{ jsonData }}</pre>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
const Init_Data = {
    Trade_Name :"",
    Trade_Path :"",
    System_Name :"",
    first_Fun:"",
    write_Name:"",
}
const OldRead_flag = ref(0)
const jsonData = ref([])

// 选中文件触发
const handleBeforeUpload = async (file) => {
  // 校验文件类型 xlsx / xls
  const acceptType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel' // xls
  ]
  if (!acceptType.includes(file.type)) {
    alert('请上传 xlsx / xls 文件')
    return false
  }
  // 读取文件
  const result = await readXlsx(file)
  jsonData.value = result
  console.log('xlsx解析结果：', result)
  return false // 阻止el-upload自动提交
}

const Creat_NewFile = ()=>{
  console.log("创建文件:")
  console.log("是否读取文件：",OldRead_flag.value )
  if(OldRead_flag.value == 0){
    alert("请先上传案例模板")
  }
  else
  {
    const Newfile_Name  = Init_Data.Trade_Name + ".xlsx"
    console.log("Init_Data",Init_Data)
    const wb = XLSX.utils.book_new()

    // ========= Sheet1：测试大纲 =========
    const sheet1Data = [
      { A1:"系统", B1:"一级工作点", C1:"要点" }
    ]
    const ws1 = XLSX.utils.json_to_sheet(sheet1Data)
    XLSX.utils.book_append_sheet(wb, ws1, "测试大纲")

    // ========= Sheet2：测试案例 =========
    const sheet2Data = [
      {A1:"系统名称",B1:"模块名称",C1:"交易名称", D1:"编号",E1:"案例属性",F1:"案例类型", G1:"操作步骤",H1:"预期结果",I1:"验证要点", J1:"编写人",K1:"测试人",L1:"前置条件"}
    ]
    const ws2 = XLSX.utils.json_to_sheet(sheet2Data)
    XLSX.utils.book_append_sheet(wb, ws2, "测试案例")

    // ========= Sheet3：问题 =========
    const sheet3Data = [
      {A1:"序号",B1:"路径",C1:"文档", D1:"问题",E1:"截图"}
    ]
    const ws3 = XLSX.utils.json_to_sheet(sheet3Data)
    XLSX.utils.book_append_sheet(wb, ws3, "问题")

    XLSX.writeFile(wb, Newfile_Name)
  }
}

/**
 * 读取xlsx文件，返回json数组
 * 动态读取 B3:G最后一行
 */
function readXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (e) => {
      try {
        const binaryStr = e.target.result
        const wb = XLSX.read(binaryStr, {type:"binary"})
        const ws = wb.Sheets[wb.SheetNames[0]]

        // 空表判断
        if(!ws['!ref']){
          alert("工作表没有任何数据！")
          resolve([])
          return
        }

        const fullRange = XLSX.utils.decode_range(ws['!ref'])
        const lastExcelRow = fullRange.e.r+1 
        const dynamicRange = `B3:G${lastExcelRow}`
        const rangeData = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          range: dynamicRange
        })
        const lineList = []
      for(const row of rangeData){
            // row 是一行单元格数组，过滤空值，用 | 分隔
            const lineStr = row.filter(cell => cell !== undefined && cell !== "").join("")
            const newLine = "验证：" + lineStr
            lineList.push(newLine)
}

        // 获取A2-E2单元格数据，增加可选链防止空单元格报错
        Init_Data.Trade_Name  = ws["A2"]?.v ?? ""
        Init_Data.Trade_Path  = ws["B2"]?.v ?? ""
        Init_Data.System_Name = ws["C2"]?.v ?? ""
        Init_Data.first_Fun   = ws["D2"]?.v ?? ""
        Init_Data.write_Name  = ws["E2"]?.v ?? ""
        OldRead_flag.value = 1



        console.log("Init_Data",Init_Data)
        console.log("rangeData",rangeData)
        console.log("拼接后的每行文本：", lineList)
        // 返回解析出来的表格数据，不再返回"你好"
        resolve(lineList)
      } catch (err) {
        console.error("读取失败", err)
        reject(err)
      }
    }
    reader.onerror = (err) => {
      reject(err)
    }
  })
}
</script>
<style scoped>
pre {
  margin-top:10px;
  padding:10px;
  background:#f5f5f5;
}
</style>
