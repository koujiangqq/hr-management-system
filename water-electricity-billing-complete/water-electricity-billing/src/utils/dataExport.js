// 数据导出工具函数
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('没有数据可导出')
    return
  }

  // 获取表头
  const headers = Object.keys(data[0])
  
  // 创建CSV内容
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // 处理包含逗号或换行符的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  // 创建下载链接
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToJSON = (data, filename) => {
  if (!data) {
    alert('没有数据可导出')
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 生成Excel模板
export const downloadTemplate = (templateType) => {
  let templateData = []
  let filename = ''

  switch (templateType) {
    case 'meterReading':
      templateData = [
        {
          '抄表月份': '2025-07',
          '电表倍率': 200,
          '尖峰起度': 1000,
          '尖峰止度': 1100,
          '高峰起度': 2000,
          '高峰止度': 2200,
          '平峰起度': 3000,
          '平峰止度': 3300,
          '低谷起度': 4000,
          '低谷止度': 4400,
          '星达总表起度': 26000,
          '星达总表止度': 27000,
          '水表1起度': 100,
          '水表1止度': 120,
          '水表2起度': 200,
          '水表2止度': 220
        }
      ]
      filename = '租户抄表数据模板'
      break
    
    case 'dormitory':
      templateData = [
        {
          '宿舍号': '403',
          '员工姓名': '张三',
          '宿舍面积': 20,
          '房租': 500,
          '押金': 1000,
          '租赁开始日期': '2025-01-01',
          '租赁结束日期': '2025-12-31',
          '水费单价': 5.22,
          '电费单价': 1.0
        }
      ]
      filename = '宿舍信息模板'
      break
    
    default:
      alert('未知的模板类型')
      return
  }

  exportToCSV(templateData, filename)
}

// 打印功能
export const printPage = (elementId) => {
  const printContent = document.getElementById(elementId)
  if (!printContent) {
    alert('找不到要打印的内容')
    return
  }

  const originalContent = document.body.innerHTML
  const printWindow = window.open('', '_blank')
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>打印</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .no-print { display: none; }
        @media print {
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      ${printContent.innerHTML}
    </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

// 从CSV文件导入数据
export const importFromCSV = (file, callback) => {
  if (!file) {
    alert('请选择文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const csv = e.target.result
      const lines = csv.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim())
          const obj = {}
          headers.forEach((header, index) => {
            obj[header] = values[index] || ''
          })
          return obj
        })
      
      callback(data)
    } catch (error) {
      alert('文件格式错误，请检查CSV文件格式')
      console.error('CSV导入错误:', error)
    }
  }
  
  reader.readAsText(file, 'UTF-8')
}

