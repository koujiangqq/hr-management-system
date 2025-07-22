import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Download, 
  Upload,
  Calculator,
  Printer,
  Users,
  Zap,
  Droplets,
  Calendar,
  DollarSign,
  FileDown,
  FileUp
} from 'lucide-react'

const DormitoryManagement = () => {
  const [dormitories, setDormitories] = useState([])
  const [meterReadings, setMeterReadings] = useState([])
  const [monthlySummary, setMonthlySummary] = useState([])

  const [newDormitory, setNewDormitory] = useState({
    number: '',
    employee: '',
    area: 30,  // 默认30㎡
    rent: 350,  // 默认350元/月
    deposit: 1000,  // 默认1000元
    leaseStart: '',  // 新增租赁开始日期
    leaseEnd: '',  // 新增租赁结束日期
    remarks: '',  // 新增备注字段
    waterPrice: 5.22,
    electricityPrice: 1.0  // 默认电价设为1.0元/度
  })

  const [editingDormitory, setEditingDormitory] = useState(null)

  // 获取上个月最后一天
  const getLastDayOfLastMonth = () => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    return lastMonth.toISOString().slice(0, 10)
  }

  const [newReading, setNewReading] = useState({
    dormitoryId: '',
    month: new Date().toISOString().slice(0, 7),
    waterPrevious: '',
    waterCurrent: '',
    electricityPrevious: '',
    electricityCurrent: '',
    readingDate: getLastDayOfLastMonth()  // 默认为上个月最后一天
  })

  const [editingReading, setEditingReading] = useState(null)

  const [isAddingDormitory, setIsAddingDormitory] = useState(false)
  const [isEditingDormitory, setIsEditingDormitory] = useState(false)
  const [isAddingReading, setIsAddingReading] = useState(false)
  const [isEditingReading, setIsEditingReading] = useState(false)

  // 组件加载时从localStorage读取数据
  useEffect(() => {
    const savedDormitories = localStorage.getItem('dormitoryData')
    const savedReadings = localStorage.getItem('dormitoryReadingHistory')
    const savedSummary = localStorage.getItem('monthlySummaryHistory')
    
    if (savedDormitories) {
      setDormitories(JSON.parse(savedDormitories))
    }
    
    if (savedReadings) {
      setMeterReadings(JSON.parse(savedReadings))
    }

    if (savedSummary) {
      setMonthlySummary(JSON.parse(savedSummary))
    }
  }, [])

  // 保存数据到localStorage
  const saveToLocalStorage = (dormitoriesData, readingsData, summaryData) => {
    localStorage.setItem('dormitoryData', JSON.stringify(dormitoriesData))
    localStorage.setItem('dormitoryReadingHistory', JSON.stringify(readingsData))
    if (summaryData) {
      localStorage.setItem('monthlySummaryHistory', JSON.stringify(summaryData))
    }
  }

  // 下载导入模板
  const downloadTemplate = () => {
    const template = {
      dormitories: [
        {
          number: "101",
          employee: "张三",
          area: "20",
          rent: "500",
          deposit: "1000",
          leaseStart: "2025-01-01",
          leaseEnd: "2025-12-31",
          waterPrice: 5.22,
          electricityPrice: 1.0
        }
      ],
      readings: [
        {
          dormitoryId: 1,
          month: "2025-07",
          waterPrevious: "100",
          waterCurrent: "120",
          electricityPrevious: "500",
          electricityCurrent: "600",
          readingDate: "2025-07-01"
        }
      ]
    }
    
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = '宿舍费用管理数据模板.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  // 导入数据
  const importData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          if (importedData.dormitories) {
            setDormitories(importedData.dormitories.map((d, index) => ({ ...d, id: Date.now() + index })))
          }
          if (importedData.readings) {
            setMeterReadings(importedData.readings.map((r, index) => ({ ...r, id: Date.now() + index })))
          }
          alert('数据导入成功')
        } catch (error) {
          alert('文件格式错误，请检查文件内容')
        }
      }
      reader.readAsText(file)
    }
  }

  // 导出数据
  const exportData = () => {
    const exportData = {
      dormitories,
      readings: meterReadings,
      monthlySummary,
      exportTime: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `宿舍费用管理数据_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 打印页面
  const printPage = () => {
    window.print()
  }

  // 打印每月汇总
  const printMonthlySummary = (summaryData) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>每月宿舍水电费汇总 - ${summaryData.month}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>每月宿舍水电费汇总</h1>
            <h2>${summaryData.month}</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>宿舍号</th>
                <th>员工姓名</th>
                <th>用水量(吨)</th>
                <th>用电量(度)</th>
                <th>水费(元)</th>
                <th>电费(元)</th>
                <th>总费用(元)</th>
              </tr>
            </thead>
            <tbody>
              ${summaryData.details.map(item => `
                <tr>
                  <td>${item.dormitoryNumber}</td>
                  <td>${item.employee}</td>
                  <td>${item.waterUsage}</td>
                  <td>${item.electricityUsage}</td>
                  <td>${item.waterFee.toFixed(2)}</td>
                  <td>${item.electricityFee.toFixed(2)}</td>
                  <td>${item.totalFee.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <p><strong>总计：</strong></p>
            <p>总用水量：${summaryData.totalWaterUsage} 吨</p>
            <p>总用电量：${summaryData.totalElectricityUsage} 度</p>
            <p>总水费：${summaryData.totalWaterFee.toFixed(2)} 元</p>
            <p>总电费：${summaryData.totalElectricityFee.toFixed(2)} 元</p>
            <p>总费用：${summaryData.totalFee.toFixed(2)} 元</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // 删除每月汇总记录
  const deleteMonthlySummary = (id) => {
    if (confirm('确定要删除这条汇总记录吗？')) {
      const updatedSummary = monthlySummary.filter(summary => summary.id !== id)
      setMonthlySummary(updatedSummary)
      saveToLocalStorage(dormitories, meterReadings, updatedSummary)
    }
  }

  // 生成每月汇总
  const generateMonthlySummary = (month) => {
    const monthReadings = meterReadings.filter(reading => reading.month === month)
    if (monthReadings.length === 0) {
      alert('该月份没有抄表记录')
      return
    }

    const summaryDetails = monthReadings.map(reading => {
      const dormitory = dormitories.find(d => d.id === reading.dormitoryId)
      if (!dormitory) return null

      const waterUsage = reading.waterCurrent - reading.waterPrevious
      const electricityUsage = reading.electricityCurrent - reading.electricityPrevious
      const waterFee = waterUsage * dormitory.waterPrice
      const electricityFee = electricityUsage * dormitory.electricityPrice
      const totalFee = waterFee + electricityFee

      return {
        dormitoryId: dormitory.id,
        dormitoryNumber: dormitory.number,
        employee: dormitory.employee,
        waterUsage,
        electricityUsage,
        waterFee,
        electricityFee,
        totalFee
      }
    }).filter(Boolean)

    const totalWaterUsage = summaryDetails.reduce((sum, item) => sum + item.waterUsage, 0)
    const totalElectricityUsage = summaryDetails.reduce((sum, item) => sum + item.electricityUsage, 0)
    const totalWaterFee = summaryDetails.reduce((sum, item) => sum + item.waterFee, 0)
    const totalElectricityFee = summaryDetails.reduce((sum, item) => sum + item.electricityFee, 0)
    const totalFee = summaryDetails.reduce((sum, item) => sum + item.totalFee, 0)

    const summary = {
      id: Date.now(),
      month,
      details: summaryDetails,
      totalWaterUsage,
      totalElectricityUsage,
      totalWaterFee,
      totalElectricityFee,
      totalFee,
      createdAt: new Date().toISOString()
    }

    const updatedSummary = [summary, ...monthlySummary]
    setMonthlySummary(updatedSummary)
    saveToLocalStorage(dormitories, meterReadings, updatedSummary)
    alert('每月汇总生成成功')
  }

  // 添加宿舍
  const addDormitory = () => {
    if (!newDormitory.number || !newDormitory.employee) {
      alert('请填写宿舍号和员工姓名')
      return
    }

    const dormitory = {
      id: Date.now(),
      ...newDormitory,
      area: parseFloat(newDormitory.area) || 0,
      rent: parseFloat(newDormitory.rent) || 0,
      deposit: parseFloat(newDormitory.deposit) || 0
    }

    const updatedDormitories = [...dormitories, dormitory]
    setDormitories(updatedDormitories)
    saveToLocalStorage(updatedDormitories, meterReadings, monthlySummary)
    
    setNewDormitory({
      number: '',
      employee: '',
      area: 30,  // 保持默认值
      rent: 350,  // 保持默认值
      deposit: 1000,  // 保持默认值
      leaseStart: '',
      leaseEnd: '',
      remarks: '',  // 新增备注字段
      waterPrice: 5.22,
      electricityPrice: 1.0
    })
    setIsAddingDormitory(false)
  }

  // 编辑宿舍
  const editDormitory = (dormitory) => {
    setEditingDormitory({ ...dormitory })
    setIsEditingDormitory(true)
  }

  // 保存编辑的宿舍
  const saveEditDormitory = () => {
    if (!editingDormitory.number || !editingDormitory.employee) {
      alert('请填写宿舍号和员工姓名')
      return
    }

    const updatedDormitories = dormitories.map(d => 
      d.id === editingDormitory.id ? {
        ...editingDormitory,
        area: parseFloat(editingDormitory.area) || 0,
        rent: parseFloat(editingDormitory.rent) || 0,
        deposit: parseFloat(editingDormitory.deposit) || 0
      } : d
    )
    
    setDormitories(updatedDormitories)
    saveToLocalStorage(updatedDormitories, meterReadings, monthlySummary)
    setEditingDormitory(null)
    setIsEditingDormitory(false)
  }

  // 删除宿舍
  const deleteDormitory = (id) => {
    if (confirm('确定要删除这个宿舍吗？')) {
      const updatedDormitories = dormitories.filter(d => d.id !== id)
      const updatedReadings = meterReadings.filter(r => r.dormitoryId !== id)
      setDormitories(updatedDormitories)
      setMeterReadings(updatedReadings)
      saveToLocalStorage(updatedDormitories, updatedReadings, monthlySummary)
    }
  }

  // 获取上期度数
  const getLastReading = (dormitoryId, currentMonth) => {
    const dormitoryReadings = meterReadings
      .filter(r => r.dormitoryId === dormitoryId && r.month < currentMonth)
      .sort((a, b) => new Date(b.month) - new Date(a.month))
    
    return dormitoryReadings.length > 0 ? dormitoryReadings[0] : null
  }

  // 当选择宿舍时自动填充上期度数
  const handleDormitorySelect = (dormitoryId) => {
    const lastReading = getLastReading(parseInt(dormitoryId), newReading.month)
    setNewReading(prev => ({
      ...prev,
      dormitoryId,
      waterPrevious: lastReading ? lastReading.waterCurrent : '',
      electricityPrevious: lastReading ? lastReading.electricityCurrent : ''
    }))
  }

  // 添加抄表记录
  const addReading = () => {
    if (!newReading.dormitoryId || !newReading.waterCurrent || !newReading.electricityCurrent) {
      alert('请填写完整的抄表信息')
      return
    }

    const reading = {
      id: Date.now(),
      ...newReading,
      dormitoryId: parseInt(newReading.dormitoryId),
      waterPrevious: parseFloat(newReading.waterPrevious) || 0,
      waterCurrent: parseFloat(newReading.waterCurrent) || 0,
      electricityPrevious: parseFloat(newReading.electricityPrevious) || 0,
      electricityCurrent: parseFloat(newReading.electricityCurrent) || 0
    }

    const updatedReadings = [...meterReadings, reading]
    setMeterReadings(updatedReadings)
    saveToLocalStorage(dormitories, updatedReadings, monthlySummary)
    
    setNewReading({
      dormitoryId: '',
      month: new Date().toISOString().slice(0, 7),
      waterPrevious: '',
      waterCurrent: '',
      electricityPrevious: '',
      electricityCurrent: '',
      readingDate: getLastDayOfLastMonth()  // 使用上个月最后一天
    })
    setIsAddingReading(false)
  }

  // 编辑抄表记录
  const editReading = (reading) => {
    setEditingReading({ ...reading })
    setIsEditingReading(true)
  }

  // 保存编辑的抄表记录
  const saveEditReading = () => {
    if (!editingReading.waterCurrent || !editingReading.electricityCurrent) {
      alert('请填写完整的抄表信息')
      return
    }

    const updatedReadings = meterReadings.map(r => 
      r.id === editingReading.id ? {
        ...editingReading,
        waterPrevious: parseFloat(editingReading.waterPrevious) || 0,
        waterCurrent: parseFloat(editingReading.waterCurrent) || 0,
        electricityPrevious: parseFloat(editingReading.electricityPrevious) || 0,
        electricityCurrent: parseFloat(editingReading.electricityCurrent) || 0
      } : r
    )
    
    setMeterReadings(updatedReadings)
    saveToLocalStorage(dormitories, updatedReadings, monthlySummary)
    setEditingReading(null)
    setIsEditingReading(false)
  }

  // 删除抄表记录
  const deleteReading = (id) => {
    if (confirm('确定要删除这条抄表记录吗？')) {
      const updatedReadings = meterReadings.filter(r => r.id !== id)
      setMeterReadings(updatedReadings)
      saveToLocalStorage(dormitories, updatedReadings, monthlySummary)
    }
  }

  // 计算费用
  const calculateFees = (reading) => {
    const dormitory = dormitories.find(d => d.id === reading.dormitoryId)
    if (!dormitory) return { waterUsage: 0, electricityUsage: 0, waterFee: 0, electricityFee: 0, totalFee: 0 }

    const waterUsage = reading.waterCurrent - reading.waterPrevious
    const electricityUsage = reading.electricityCurrent - reading.electricityPrevious
    const waterFee = waterUsage * dormitory.waterPrice
    const electricityFee = electricityUsage * dormitory.electricityPrice
    const totalFee = waterFee + electricityFee

    return { waterUsage, electricityUsage, waterFee, electricityFee, totalFee }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">宿舍费用管理</h1>
          <p className="text-gray-600 mt-1">管理员工宿舍信息和水电费用</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadTemplate} variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            导入模板下载
          </Button>
          <Button onClick={() => document.getElementById('import-file-dorm').click()} variant="outline" size="sm">
            <FileUp className="w-4 h-4 mr-2" />
            导入数据
          </Button>
          <input
            id="import-file-dorm"
            type="file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
          />
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
          <Button onClick={printPage} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            打印
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dormitory-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dormitory-info">宿舍信息管理</TabsTrigger>
          <TabsTrigger value="meter-reading">抄表录入</TabsTrigger>
          <TabsTrigger value="billing">宿舍费用账单</TabsTrigger>
          <TabsTrigger value="monthly-summary">每月宿舍水电费汇总</TabsTrigger>
        </TabsList>

        {/* 宿舍信息管理 */}
        <TabsContent value="dormitory-info">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  宿舍信息管理
                </CardTitle>
                <Button onClick={() => setIsAddingDormitory(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加宿舍
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dormitories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无宿舍信息，请添加宿舍
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>宿舍号</TableHead>
                      <TableHead>员工姓名</TableHead>
                      <TableHead>面积(㎡)</TableHead>
                      <TableHead>房租(元/套)</TableHead>
                      <TableHead>押金(元)</TableHead>
                      <TableHead>租赁期</TableHead>
                      <TableHead>水价(元/吨)</TableHead>
                      <TableHead>电价(元/度)</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dormitories.map((dormitory) => (
                      <TableRow key={dormitory.id}>
                        <TableCell>{dormitory.number}</TableCell>
                        <TableCell>{dormitory.employee}</TableCell>
                        <TableCell>{dormitory.area}</TableCell>
                        <TableCell>{dormitory.rent}</TableCell>
                        <TableCell>{dormitory.deposit}</TableCell>
                        <TableCell>
                          {dormitory.leaseStart && dormitory.leaseEnd 
                            ? `${dormitory.leaseStart} 至 ${dormitory.leaseEnd}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{dormitory.waterPrice}</TableCell>
                        <TableCell>{dormitory.electricityPrice}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editDormitory(dormitory)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDormitory(dormitory.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 抄表录入 */}
        <TabsContent value="meter-reading">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  抄表录入
                </CardTitle>
                <Button onClick={() => setIsAddingReading(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加抄表记录
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {meterReadings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无抄表记录，请添加抄表记录
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>宿舍号</TableHead>
                      <TableHead>员工姓名</TableHead>
                      <TableHead>月份</TableHead>
                      <TableHead>水表读数</TableHead>
                      <TableHead>电表读数</TableHead>
                      <TableHead>用水量(吨)</TableHead>
                      <TableHead>用电量(度)</TableHead>
                      <TableHead>抄表日期</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meterReadings.map((reading) => {
                      const dormitory = dormitories.find(d => d.id === reading.dormitoryId)
                      const fees = calculateFees(reading)
                      return (
                        <TableRow key={reading.id}>
                          <TableCell>{dormitory?.number || '-'}</TableCell>
                          <TableCell>{dormitory?.employee || '-'}</TableCell>
                          <TableCell>{reading.month}</TableCell>
                          <TableCell>{reading.waterPrevious} → {reading.waterCurrent}</TableCell>
                          <TableCell>{reading.electricityPrevious} → {reading.electricityCurrent}</TableCell>
                          <TableCell>{fees.waterUsage.toFixed(2)}</TableCell>
                          <TableCell>{fees.electricityUsage.toFixed(2)}</TableCell>
                          <TableCell>{reading.readingDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editReading(reading)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteReading(reading.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 宿舍费用账单 */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                宿舍费用账单
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meterReadings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无抄表记录，无法生成账单
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>宿舍号</TableHead>
                      <TableHead>员工姓名</TableHead>
                      <TableHead>月份</TableHead>
                      <TableHead>用水量(吨)</TableHead>
                      <TableHead>用电量(度)</TableHead>
                      <TableHead>水费(元)</TableHead>
                      <TableHead>电费(元)</TableHead>
                      <TableHead>总费用(元)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meterReadings.map((reading) => {
                      const dormitory = dormitories.find(d => d.id === reading.dormitoryId)
                      const fees = calculateFees(reading)
                      return (
                        <TableRow key={reading.id}>
                          <TableCell>{dormitory?.number || '-'}</TableCell>
                          <TableCell>{dormitory?.employee || '-'}</TableCell>
                          <TableCell>{reading.month}</TableCell>
                          <TableCell>{fees.waterUsage.toFixed(2)}</TableCell>
                          <TableCell>{fees.electricityUsage.toFixed(2)}</TableCell>
                          <TableCell>{fees.waterFee.toFixed(2)}</TableCell>
                          <TableCell>{fees.electricityFee.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">{fees.totalFee.toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 每月宿舍水电费汇总 */}
        <TabsContent value="monthly-summary">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  每月宿舍水电费汇总
                </CardTitle>
                <div className="flex gap-2">
                  <Input
                    type="month"
                    placeholder="选择月份"
                    onChange={(e) => {
                      if (e.target.value) {
                        generateMonthlySummary(e.target.value)
                      }
                    }}
                    className="w-40"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {monthlySummary.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无汇总记录，请选择月份生成汇总
                </div>
              ) : (
                <div className="space-y-4">
                  {monthlySummary.map((summary) => (
                    <Card key={summary.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{summary.month} 月汇总</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => printMonthlySummary(summary)}
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              打印
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMonthlySummary(summary.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>宿舍号</TableHead>
                              <TableHead>员工姓名</TableHead>
                              <TableHead>用水量(吨)</TableHead>
                              <TableHead>用电量(度)</TableHead>
                              <TableHead>水费(元)</TableHead>
                              <TableHead>电费(元)</TableHead>
                              <TableHead>总费用(元)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {summary.details.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.dormitoryNumber}</TableCell>
                                <TableCell>{item.employee}</TableCell>
                                <TableCell>{item.waterUsage.toFixed(2)}</TableCell>
                                <TableCell>{item.electricityUsage.toFixed(2)}</TableCell>
                                <TableCell>{item.waterFee.toFixed(2)}</TableCell>
                                <TableCell>{item.electricityFee.toFixed(2)}</TableCell>
                                <TableCell className="font-semibold">{item.totalFee.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-gray-50 font-semibold">
                              <TableCell colSpan={2}>合计</TableCell>
                              <TableCell>{summary.totalWaterUsage.toFixed(2)}</TableCell>
                              <TableCell>{summary.totalElectricityUsage.toFixed(2)}</TableCell>
                              <TableCell>{summary.totalWaterFee.toFixed(2)}</TableCell>
                              <TableCell>{summary.totalElectricityFee.toFixed(2)}</TableCell>
                              <TableCell>{summary.totalFee.toFixed(2)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 添加宿舍对话框 */}
      <Dialog open={isAddingDormitory} onOpenChange={setIsAddingDormitory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加宿舍</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number">宿舍号</Label>
              <Input
                id="number"
                value={newDormitory.number}
                onChange={(e) => setNewDormitory({...newDormitory, number: e.target.value})}
                placeholder="输入宿舍号"
              />
            </div>
            <div>
              <Label htmlFor="employee">员工姓名</Label>
              <Input
                id="employee"
                value={newDormitory.employee}
                onChange={(e) => setNewDormitory({...newDormitory, employee: e.target.value})}
                placeholder="输入员工姓名"
              />
            </div>
            <div>
              <Label htmlFor="area">宿舍面积(㎡)</Label>
              <Input
                id="area"
                type="number"
                value={newDormitory.area}
                onChange={(e) => setNewDormitory({...newDormitory, area: e.target.value})}
                placeholder="输入宿舍面积"
              />
            </div>
            <div>
              <Label htmlFor="rent">房租(元/套)</Label>
              <Input
                id="rent"
                type="number"
                value={newDormitory.rent}
                onChange={(e) => setNewDormitory({...newDormitory, rent: e.target.value})}
                placeholder="输入房租"
              />
            </div>
            <div>
              <Label htmlFor="deposit">押金(元)</Label>
              <Input
                id="deposit"
                type="number"
                value={newDormitory.deposit}
                onChange={(e) => setNewDormitory({...newDormitory, deposit: e.target.value})}
                placeholder="输入押金"
              />
            </div>
            <div>
              <Label htmlFor="leaseStart">租赁开始日期</Label>
              <Input
                id="leaseStart"
                type="date"
                value={newDormitory.leaseStart}
                onChange={(e) => setNewDormitory({...newDormitory, leaseStart: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="leaseEnd">租赁结束日期</Label>
              <Input
                id="leaseEnd"
                type="date"
                value={newDormitory.leaseEnd}
                onChange={(e) => setNewDormitory({...newDormitory, leaseEnd: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="waterPrice">水价(元/吨)</Label>
              <Input
                id="waterPrice"
                type="number"
                step="0.01"
                value={newDormitory.waterPrice}
                onChange={(e) => setNewDormitory({...newDormitory, waterPrice: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="electricityPrice">电价(元/度)</Label>
              <Input
                id="electricityPrice"
                type="number"
                step="0.01"
                value={newDormitory.electricityPrice}
                onChange={(e) => setNewDormitory({...newDormitory, electricityPrice: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddingDormitory(false)}>
              取消
            </Button>
            <Button onClick={addDormitory}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑宿舍对话框 */}
      <Dialog open={isEditingDormitory} onOpenChange={setIsEditingDormitory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑宿舍</DialogTitle>
          </DialogHeader>
          {editingDormitory && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-number">宿舍号</Label>
                <Input
                  id="edit-number"
                  value={editingDormitory.number}
                  onChange={(e) => setEditingDormitory({...editingDormitory, number: e.target.value})}
                  placeholder="输入宿舍号"
                />
              </div>
              <div>
                <Label htmlFor="edit-employee">员工姓名</Label>
                <Input
                  id="edit-employee"
                  value={editingDormitory.employee}
                  onChange={(e) => setEditingDormitory({...editingDormitory, employee: e.target.value})}
                  placeholder="输入员工姓名"
                />
              </div>
              <div>
                <Label htmlFor="edit-area">宿舍面积(㎡)</Label>
                <Input
                  id="edit-area"
                  type="number"
                  value={editingDormitory.area}
                  onChange={(e) => setEditingDormitory({...editingDormitory, area: e.target.value})}
                  placeholder="输入宿舍面积"
                />
              </div>
              <div>
                <Label htmlFor="edit-rent">房租(元/套)</Label>
                <Input
                  id="edit-rent"
                  type="number"
                  value={editingDormitory.rent}
                  onChange={(e) => setEditingDormitory({...editingDormitory, rent: e.target.value})}
                  placeholder="输入房租"
                />
              </div>
              <div>
                <Label htmlFor="edit-deposit">押金(元)</Label>
                <Input
                  id="edit-deposit"
                  type="number"
                  value={editingDormitory.deposit}
                  onChange={(e) => setEditingDormitory({...editingDormitory, deposit: e.target.value})}
                  placeholder="输入押金"
                />
              </div>
              <div>
                <Label htmlFor="edit-leaseStart">租赁开始日期</Label>
                <Input
                  id="edit-leaseStart"
                  type="date"
                  value={editingDormitory.leaseStart}
                  onChange={(e) => setEditingDormitory({...editingDormitory, leaseStart: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-leaseEnd">租赁结束日期</Label>
                <Input
                  id="edit-leaseEnd"
                  type="date"
                  value={editingDormitory.leaseEnd}
                  onChange={(e) => setEditingDormitory({...editingDormitory, leaseEnd: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-waterPrice">水价(元/吨)</Label>
                <Input
                  id="edit-waterPrice"
                  type="number"
                  step="0.01"
                  value={editingDormitory.waterPrice}
                  onChange={(e) => setEditingDormitory({...editingDormitory, waterPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="edit-electricityPrice">电价(元/度)</Label>
                <Input
                  id="edit-electricityPrice"
                  type="number"
                  step="0.01"
                  value={editingDormitory.electricityPrice}
                  onChange={(e) => setEditingDormitory({...editingDormitory, electricityPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditingDormitory(false)}>
              取消
            </Button>
            <Button onClick={saveEditDormitory}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加抄表记录对话框 */}
      <Dialog open={isAddingReading} onOpenChange={setIsAddingReading}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加抄表记录</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dormitorySelect">选择宿舍</Label>
              <select
                id="dormitorySelect"
                className="w-full p-2 border rounded"
                value={newReading.dormitoryId}
                onChange={(e) => handleDormitorySelect(e.target.value)}
              >
                <option value="">请选择宿舍</option>
                {dormitories.map((dormitory) => (
                  <option key={dormitory.id} value={dormitory.id}>
                    {dormitory.number} - {dormitory.employee}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="month">抄表月份</Label>
              <Input
                id="month"
                type="month"
                value={newReading.month}
                onChange={(e) => setNewReading({...newReading, month: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="waterPrevious">水表上期度数</Label>
              <Input
                id="waterPrevious"
                type="number"
                value={newReading.waterPrevious}
                onChange={(e) => setNewReading({...newReading, waterPrevious: e.target.value})}
                placeholder="自动填充或手动输入"
              />
            </div>
            <div>
              <Label htmlFor="waterCurrent">水表本期度数</Label>
              <Input
                id="waterCurrent"
                type="number"
                value={newReading.waterCurrent}
                onChange={(e) => setNewReading({...newReading, waterCurrent: e.target.value})}
                placeholder="输入本期度数"
              />
            </div>
            <div>
              <Label htmlFor="electricityPrevious">电表上期度数</Label>
              <Input
                id="electricityPrevious"
                type="number"
                value={newReading.electricityPrevious}
                onChange={(e) => setNewReading({...newReading, electricityPrevious: e.target.value})}
                placeholder="自动填充或手动输入"
              />
            </div>
            <div>
              <Label htmlFor="electricityCurrent">电表本期度数</Label>
              <Input
                id="electricityCurrent"
                type="number"
                value={newReading.electricityCurrent}
                onChange={(e) => setNewReading({...newReading, electricityCurrent: e.target.value})}
                placeholder="输入本期度数"
              />
            </div>
            <div>
              <Label htmlFor="readingDate">抄表日期</Label>
              <Input
                id="readingDate"
                type="date"
                value={newReading.readingDate}
                onChange={(e) => setNewReading({...newReading, readingDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddingReading(false)}>
              取消
            </Button>
            <Button onClick={addReading}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑抄表记录对话框 */}
      <Dialog open={isEditingReading} onOpenChange={setIsEditingReading}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑抄表记录</DialogTitle>
          </DialogHeader>
          {editingReading && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-month">抄表月份</Label>
                <Input
                  id="edit-month"
                  type="month"
                  value={editingReading.month}
                  onChange={(e) => setEditingReading({...editingReading, month: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-waterPrevious">水表上期度数</Label>
                <Input
                  id="edit-waterPrevious"
                  type="number"
                  value={editingReading.waterPrevious}
                  onChange={(e) => setEditingReading({...editingReading, waterPrevious: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-waterCurrent">水表本期度数</Label>
                <Input
                  id="edit-waterCurrent"
                  type="number"
                  value={editingReading.waterCurrent}
                  onChange={(e) => setEditingReading({...editingReading, waterCurrent: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-electricityPrevious">电表上期度数</Label>
                <Input
                  id="edit-electricityPrevious"
                  type="number"
                  value={editingReading.electricityPrevious}
                  onChange={(e) => setEditingReading({...editingReading, electricityPrevious: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-electricityCurrent">电表本期度数</Label>
                <Input
                  id="edit-electricityCurrent"
                  type="number"
                  value={editingReading.electricityCurrent}
                  onChange={(e) => setEditingReading({...editingReading, electricityCurrent: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-readingDate">抄表日期</Label>
                <Input
                  id="edit-readingDate"
                  type="date"
                  value={editingReading.readingDate}
                  onChange={(e) => setEditingReading({...editingReading, readingDate: e.target.value})}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditingReading(false)}>
              取消
            </Button>
            <Button onClick={saveEditReading}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DormitoryManagement

