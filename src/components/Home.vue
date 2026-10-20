<template>
  <div>
    <div style="display: flex; gap: 10px;">
      <el-upload action="#" :before-upload="handleBeforeUpload">
        <el-button type="primary">
          选择xlsx文件
          <el-icon><Upload /></el-icon>
        </el-button>
      </el-upload>
      <el-button type="primary" @click="Creat_NewFile">生成新文件</el-button>
      <el-button type="success" @click="handleInvert">反选</el-button>
      
    </div>
    <h3>解析出来的数据（共 {{ tableData.length }} 条，已选 {{ selectedRows.length }} 条）</h3>
    <el-table
      ref="tableRef"
      :data="tableData"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @cell-dblclick="handleCellDblClick"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="caseAttr" label="案例属性" width="130" align="center">
        <template #default="scope">
          <el-select v-model="scope.row.caseAttr" placeholder="请选择" clearable size="small">
            <el-option v-for="item in caseAttrOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="caseType" label="案例类型" width="110" align="center">
        <template #default="scope">
          <el-select v-model="scope.row.caseType" placeholder="请选择" clearable size="small">
            <el-option v-for="item in caseTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="step" label="操作步骤" min-width="280" show-overflow-tooltip>
        <template #default="scope">
          <el-input
            v-if="scope.row.isEditStep"
            v-model="scope.row.step"
            type="textarea"
            :rows="2"
            size="small"
            @blur="scope.row.isEditStep = false"
            @keyup.enter="scope.row.isEditStep = false"
          />
          <span v-else>{{ scope.row.step }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="预期结果" min-width="280" show-overflow-tooltip>
        <template #default="scope">
          <el-input
            v-if="scope.row.isEditResult"
            v-model="scope.row.result"
            type="textarea"
            :rows="2"
            size="small"
            @blur="scope.row.isEditResult = false"
            @keyup.enter="scope.row.isEditResult = false"
          />
          <span v-else>{{ scope.row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="验证要点" min-width="300" show-overflow-tooltip>
        <template #default="scope">
          <el-input
            v-if="scope.row.isEdit"
            v-model="scope.row.content"
            type="textarea"
            :rows="2"
            size="small"
            @blur="scope.row.isEdit = false"
            @keyup.enter="scope.row.isEdit = false"
          />
          <span v-else>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
// ⚠️ 必须换成 xlsx-js-style 才能写黄色表头和字号
import * as XLSX from 'xlsx-js-style'
import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
const Init_Data = {
  File_Name:"",
  Trade_Name: "",
  Trade_Path: "",
  System_Name: "",
  first_Fun: "",
  write_Name: "",
}
const caseAttrOptions = ref([])
const caseTypeOptions = ref([])
const OldRead_flag = ref(0)
const tableData = ref([])
const selectedRows = ref([])
const tableRef = ref(null)

const handleSelectionChange = (rows) => { selectedRows.value = rows }

const handleInvert = () => {
  tableRef.value.data.forEach((row) => {
    const checked = selectedRows.value.includes(row)
    tableRef.value.toggleRowSelection(row, !checked)
  })
}

const handleCellDblClick = (row, column) => {
  if (!['content', 'step', 'result'].includes(column.property)) return
  tableData.value.forEach(item => {
    item.isEdit = false
    item.isEditStep = false
    item.isEditResult = false
  })
  if (column.property === 'content') row.isEdit = true
  if (column.property === 'step') row.isEditStep = true
  if (column.property === 'result') row.isEditResult = true
}

const handleBeforeUpload = async (file) => {
  const acceptType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
  if (!acceptType.includes(file.type)) { alert('请上传 xlsx / xls 文件'); return false }
  const { lineList, attrOpts, typeOpts, AttriData, typeData, stepData, resuData } = await readXlsx(file)
  caseAttrOptions.value = attrOpts
  caseTypeOptions.value = typeOpts
  tableData.value = lineList.map((content, i) => ({
    id: i,
    content,
    caseAttr: AttriData[i]?.[0] ?? "",
    caseType: typeData[i]?.[0] ?? "",
    step: stepData[i]?.[0] ?? "",
    result: resuData[i]?.[0] ?? "",
    isEdit: false,
    isEditStep: false,
    isEditResult: false
  }))
  setTimeout(() => {
    tableRef.value?.clearSelection()
    tableData.value.forEach(row => tableRef.value?.toggleRowSelection(row, true))
  }, 0)
  return false
}

const Creat_NewFile = () => {
  if (OldRead_flag.value == 0) { alert("请先上传案例模板"); return }
  if (!Init_Data.Trade_Name) { alert("交易名称为空，无法生成文件名！"); return }
  if (selectedRows.value.length === 0) { alert("请至少勾选一条验证要点"); return }
  for (let row of selectedRows.value) {
    if (!row.caseAttr) { alert(`【第${row.id + 1}行】案例属性未选择，请检查！`); return }
    if (!row.caseType) { alert(`【第${row.id + 1}行】案例类型未选择，请检查！`); return }
  }

  const Newfile_Name = Init_Data.File_Name + ".xlsx"
  const wb = XLSX.utils.book_new()

  // ========== Sheet1：测试大纲 ==========
  const sheet1Aoa = [["系统", "一级工作点", "要点"]]
  selectedRows.value.forEach(row => {
    sheet1Aoa.push([
      Init_Data.System_Name,
      Init_Data.first_Fun,
      row.content
    ])
  })
  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Aoa)
  ws1['!cols'] = [
    { wch: 12 },   // A 系统
    { wch: 18 },   // B 一级工作点
    { wch: 60 }    // C 要点（调大）
  ]
  XLSX.utils.book_append_sheet(wb, ws1, "测试大纲")

  // ========== Sheet2：测试案例 ==========
  const header = ["系统名称","模块名称","交易名称","案例编号","案例属性","案例类型","验证要点","前置条件","操作步骤","预期结果","编写人","测试人","案例等级","所属专项","是否动账"
]
  const sheet2Aoa = [header]
  selectedRows.value.forEach((row, idx) => {
    const caseNo = String(idx + 1).padStart(3, "0")
    sheet2Aoa.push([
      Init_Data.System_Name,
      Init_Data.Trade_Path,
      Init_Data.Trade_Name,
      caseNo,
      row.caseAttr,
      row.caseType,
      row.content,
      "",
      row.step,
      row.result,
      Init_Data.write_Name,
      "",
      "",
      "",
      "",
    ])
  })
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Aoa)

  // 只合并 B 列（模块名称）
  const dataRowCount = selectedRows.value.length
  if (dataRowCount > 1) {
    ws2['!merges'] = [
      { s: { r: 1, c: 1 }, e: { r: dataRowCount, c: 1 } }
    ]
  }

  // 表头黄色 + 18号字
  const headerStyle = {
    font: { sz: 18, bold: true },
    fill: { fgColor: { rgb: "FFFFFF00" } },
    alignment: { horizontal: "center", vertical: "center" }
  }
  for (let c = 0; c < header.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: c })
    if (ws2[addr]) ws2[addr].s = headerStyle
  }

  // 列宽：GHI(6,7,8) 设置宽度60
  ws2['!cols'] = [
    {wch:15},   	// A 系统名称
    {wch:15},   	// B 模块名称
    {wch:15},   	// C 交易名称
    {wch:8},    	// D 案例编号
    {wch:12},   	// E 案例属性
    {wch:12},   	// F 案例类型
    {wch:50},   	// G 验证要点
    {wch:15},   	// H 前置条件
    {wch:50},   	// I 操作步骤
    {wch:40},   	// J 预期结果
    {wch:10},   	// K 编写人
    {wch:10},   	// L 测试人
    {wch:10},   	// L 案例等级
    {wch:10},   	// L 所属专项
    {wch:10}    	// L 是否动账
  ]

  // G/H/I列 数据行开启自动换行，垂直居中
  for (let r = 1; r <= dataRowCount; r++) {
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(c => {
      const addr = XLSX.utils.encode_cell({ r, c })
      if (ws2[addr]) {
        ws2[addr].s = {
          ...(ws2[addr].s || {}),
          alignment: { wrapText: true, vertical: "center" }
        }
      }
    })
  }

  XLSX.utils.book_append_sheet(wb, ws2, "测试案例")

  // Sheet3：问题
  const ws3 = XLSX.utils.aoa_to_sheet([["序号","路径","文档","问题","截图"]])
  XLSX.utils.book_append_sheet(wb, ws3, "问题")

  XLSX.writeFile(wb, Newfile_Name)
}


function readXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "binary" })
        const ws = wb.Sheets[wb.SheetNames[0]]
        if (!ws['!ref']) {
          alert("工作表没有任何数据！")
          resolve({ lineList: [], attrOpts: [], typeOpts: [], AttriData: [], typeData: [], stepData: [], resuData: [] })
          return
        }
        const fullRange = XLSX.utils.decode_range(ws['!ref'])
        const lastExcelRow = fullRange.e.r + 1
        const dynamicRange = `C4:H${lastExcelRow}`
        const AttriRange = `A4:A${lastExcelRow}`
        const typeRange = `B4:B${lastExcelRow}`
        const resuRange = `H4:H${lastExcelRow}`
        const rangeData = XLSX.utils.sheet_to_json(ws, { header: 1, range: dynamicRange })
        const AttriData = XLSX.utils.sheet_to_json(ws, { header: 1, range: AttriRange })
        const typeData = XLSX.utils.sheet_to_json(ws, { header: 1, range: typeRange })
        const resuData = XLSX.utils.sheet_to_json(ws, { header: 1, range: resuRange })
        const lineList = []
        for (const row of rangeData) {
          const lineStr = row.filter(c => c !== undefined && c !== "").join("")
          if (lineStr) lineList.push("验证：" + lineStr)
        }
        const attrOpts = AttriData
          .map(item => item[0])
          .filter(v => v !== undefined && v !== '')
          .filter((val, idx, self) => self.indexOf(val) === idx)
        const typeOpts = typeData
          .map(item => item[0])
          .filter(v => v !== undefined && v !== '')
          .filter((val, idx, self) => self.indexOf(val) === idx)
        const md = dayjs().format('MMDD')

        Init_Data.File_Name = md + ws["A2"].v +"-"+ws["E2"].v
        Init_Data.Trade_Name  = ws["A2"]?.v ?? ""
        Init_Data.Trade_Path  = ws["B2"]?.v ?? ""
        Init_Data.System_Name = ws["C2"]?.v ?? ""
        Init_Data.first_Fun   = ws["D2"]?.v ?? ""
        Init_Data.write_Name  = ws["E2"]?.v ?? ""
        OldRead_flag.value = 1
        console.log("Init_Data:",Init_Data)
        let steprangeData = XLSX.utils.sheet_to_json(ws, { header: 1, range: dynamicRange })
        steprangeData = steprangeData.map(row => row.slice(0, -1))
        const stepData = steprangeData.map((row) => {
          const validItems = row.filter(item => item !== undefined && item !== null && item !== "")
          if (validItems.length === 0) return [""]
          const processedList = validItems.map((txt, innerIdx) => {
            let s = txt.trim().replace(/[，,--\s]+$/, "")
            return `${innerIdx + 1}，${s}；`
          })
          return [processedList.join("")]
        })

        resolve({ lineList, attrOpts, typeOpts, AttriData, typeData, stepData, resuData })
      } catch (err) {
        console.error("读取失败", err)
        reject(err)
      }
    }
    reader.onerror = reject
  })
}
</script>

<style scoped>
h3 { margin: 16px 0 8px; }
</style>
