import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calculator, 
  Save, 
  Download, 
  Upload,
  TrendingUp,
  Zap,
  Droplets,
  Trash2,
  Edit,
  FileDown,
  FileUp,
  Printer
} from 'lucide-react'

const MeterReading = () => {
  // 获取上个月的年月
  const getLastMonth = () => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return lastMonth.toISOString().slice(0, 7)
  }

  const [formData, setFormData] = useState({
    month: getLastMonth(),
    // 电表1分时段数据
    electricMeter1Peak: { start: '', end: '' },      // 尖峰时段
    electricMeter1High: { start: '', end: '' },      // 高峰时段
    electricMeter1Normal: { start: '', end: '' },    // 平峰时段
    electricMeter1Valley: { start: '', end: '' },    // 低谷时段
    totalMeterStart: '',
    totalMeterEnd: '',
    multiplier: 200,
    waterMeter1Start: '',
    waterMeter1End: '',
    waterMeter2Start: '',
    waterMeter2End: ''
  })

  const [calculated, setCalculated] = useState({
    actualElectricity: 0,
    totalElectricity: 0,
    lossElectricity: 0,
    lossRate: 0,
    waterUsage: 0,
    peakUsage: 0,
    highUsage: 0,
    normalUsage: 0,
    valleyUsage: 0
  })

  const [history, setHistory] = useState([])
  const [selectedHistoryId, setSelectedHistoryId] = useState(null)

  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('meterReadingHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 自动填充上月数据
  useEffect(() => {
    const currentMonth = formData.month
    if (history.length > 0) {
      // 查找上个月的数据
      const lastMonthData = history.find(record => {
        const recordDate = new Date(record.month + '-01')
        const currentDate = new Date(currentMonth + '-01')
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        return recordDate.getTime() === lastMonth.getTime()
      })

      if (lastMonthData) {
        // 自动填充起度为上月止度
        setFormData(prev => ({
          ...prev,
          electricMeter1Peak: { 
            start: lastMonthData.electricMeter1Peak?.end || '', 
            end: prev.electricMeter1Peak.end 
          },
          electricMeter1High: { 
            start: lastMonthData.electricMeter1High?.end || '', 
            end: prev.electricMeter1High.end 
          },
          electricMeter1Normal: { 
            start: lastMonthData.electricMeter1Normal?.end || '', 
            end: prev.electricMeter1Normal.end 
          },
          electricMeter1Valley: { 
            start: lastMonthData.electricMeter1Valley?.end || '', 
            end: prev.electricMeter1Valley.end 
          },
          totalMeterStart: lastMonthData.totalMeterEnd || '',
          waterMeter1Start: lastMonthData.waterMeter1End || '',
          waterMeter2Start: lastMonthData.waterMeter2End || ''
        }))
      }
    }
  }, [formData.month, history])

  // 计算用电量和损耗
  const calculateElectricity = () => {
    const peakUsage = (parseFloat(formData.electricMeter1Peak.end) || 0) - (parseFloat(formData.electricMeter1Peak.start) || 0)
    const highUsage = (parseFloat(formData.electricMeter1High.end) || 0) - (parseFloat(formData.electricMeter1High.start) || 0)
    const normalUsage = (parseFloat(formData.electricMeter1Normal.end) || 0) - (parseFloat(formData.electricMeter1Normal.start) || 0)
    const valleyUsage = (parseFloat(formData.electricMeter1Valley.end) || 0) - (parseFloat(formData.electricMeter1Valley.start) || 0)
    
    const actualElectricity = (peakUsage + highUsage + normalUsage + valleyUsage) * formData.multiplier
    const totalElectricity = ((parseFloat(formData.totalMeterEnd) || 0) - (parseFloat(formData.totalMeterStart) || 0)) * formData.multiplier
    const lossElectricity = totalElectricity - actualElectricity
    const lossRate = totalElectricity > 0 ? (lossElectricity / totalElectricity * 100) : 0
    const waterUsage = (parseFloat(formData.waterMeter1End) || 0) - (parseFloat(formData.waterMeter1Start) || 0) + 
                      (parseFloat(formData.waterMeter2End) || 0) - (parseFloat(formData.waterMeter2Start) || 0)

    setCalculated({
      actualElectricity,
      totalElectricity,
      lossElectricity,
      lossRate,
      waterUsage,
      peakUsage: peakUsage * formData.multiplier,
      highUsage: highUsage * formData.multiplier,
      normalUsage: normalUsage * formData.multiplier,
      valleyUsage: valleyUsage * formData.multiplier
    })
  }

  // 监听表单数据变化，自动计算
  useEffect(() => {
    calculateElectricity()
  }, [formData])

  // 保存历史记录到localStorage
  const saveToHistory = () => {
    const newRecord = {
      id: Date.now(),
      month: formData.month,
      ...formData,
      ...calculated,
      createdAt: new Date().toISOString()
    }
    
    const updatedHistory = [newRecord, ...history]
    setHistory(updatedHistory)
    localStorage.setItem('meterReadingHistory', JSON.stringify(updatedHistory))
    alert('数据已保存到历史记录')
  }

  // 删除历史记录
  const deleteHistoryRecord = (id) => {
    if (confirm('确定要删除这条记录吗？')) {
      const updatedHistory = history.filter(record => record.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem('meterReadingHistory', JSON.stringify(updatedHistory))
      
      // 如果删除的是当前选中的记录，清空选中状态
      if (selectedHistoryId === id) {
        setSelectedHistoryId(null)
      }
    }
  }

  // 选择历史记录并回显数据
  const selectHistoryRecord = (record) => {
    setSelectedHistoryId(record.id)
    setFormData({
      month: record.month,
      electricMeter1Peak: record.electricMeter1Peak || { start: '', end: '' },
      electricMeter1High: record.electricMeter1High || { start: '', end: '' },
      electricMeter1Normal: record.electricMeter1Normal || { start: '', end: '' },
      electricMeter1Valley: record.electricMeter1Valley || { start: '', end: '' },
      totalMeterStart: record.totalMeterStart || '',
      totalMeterEnd: record.totalMeterEnd || '',
      multiplier: record.multiplier || 200,
      waterMeter1Start: record.waterMeter1Start || '',
      waterMeter1End: record.waterMeter1End || '',
      waterMeter2Start: record.waterMeter2Start || '',
      waterMeter2End: record.waterMeter2End || ''
    })
    setCalculated({
      actualElectricity: record.actualElectricity || 0,
      totalElectricity: record.totalElectricity || 0,
      lossElectricity: record.lossElectricity || 0,
      lossRate: record.lossRate || 0,
      waterUsage: record.waterUsage || 0,
      peakUsage: record.peakUsage || 0,
      highUsage: record.highUsage || 0,
      normalUsage: record.normalUsage || 0,
      valleyUsage: record.valleyUsage || 0
    })
  }

  // 下载导入模板
  const downloadTemplate = () => {
    // 创建Excel格式的模板数据
    const templateData = [
      ['字段名', '示例值', '说明'],
      ['抄表月份', '2025-07', 'YYYY-MM格式'],
      ['电表倍率', '200', '数字'],
      ['尖峰时段起度', '1000', '数字'],
      ['尖峰时段止度', '1100', '数字'],
      ['高峰时段起度', '2000', '数字'],
      ['高峰时段止度', '2200', '数字'],
      ['平峰时段起度', '3000', '数字'],
      ['平峰时段止度', '3300', '数字'],
      ['低谷时段起度', '4000', '数字'],
      ['低谷时段止度', '4400', '数字'],
      ['星达总表起度', '26000', '数字'],
      ['星达总表止度', '27000', '数字'],
      ['水表1起度', '1000', '数字'],
      ['水表1止度', '1100', '数字'],
      ['水表2起度', '2000', '数字'],
      ['水表2止度', '2100', '数字']
    ]
    
    // 创建CSV内容（Excel可以打开）
    const csvContent = templateData.map(row => row.join(',')).join('\n')
    const dataBlob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = '租户抄表数据模板.xlsx'
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
          // 支持JSON和CSV格式
          let importedData
          if (file.name.endsWith('.json')) {
            importedData = JSON.parse(e.target.result)
          } else {
            // 简单的CSV解析
            const lines = e.target.result.split('\n')
            importedData = {}
            lines.forEach(line => {
              const [key, value] = line.split(',')
              if (key && value) {
                importedData[key.trim()] = value.trim()
              }
            })
          }
          
          setFormData({
            ...formData,
            ...importedData
          })
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
      ...formData,
      ...calculated,
      exportTime: new Date().toISOString()
    }
    
    // 创建CSV格式的导出数据
    const csvData = [
      ['字段名', '值'],
      ['抄表月份', exportData.month],
      ['电表倍率', exportData.multiplier],
      ['尖峰时段起度', exportData.electricMeter1Peak?.start || ''],
      ['尖峰时段止度', exportData.electricMeter1Peak?.end || ''],
      ['高峰时段起度', exportData.electricMeter1High?.start || ''],
      ['高峰时段止度', exportData.electricMeter1High?.end || ''],
      ['平峰时段起度', exportData.electricMeter1Normal?.start || ''],
      ['平峰时段止度', exportData.electricMeter1Normal?.end || ''],
      ['低谷时段起度', exportData.electricMeter1Valley?.start || ''],
      ['低谷时段止度', exportData.electricMeter1Valley?.end || ''],
      ['星达总表起度', exportData.totalMeterStart],
      ['星达总表止度', exportData.totalMeterEnd],
      ['水表1起度', exportData.waterMeter1Start],
      ['水表1止度', exportData.waterMeter1End],
      ['水表2起度', exportData.waterMeter2Start],
      ['水表2止度', exportData.waterMeter2End],
      ['实际用电量(度)', exportData.actualElectricity],
      ['星达总表电量(度)', exportData.totalElectricity],
      ['损耗电量(度)', exportData.lossElectricity],
      ['损耗率(%)', exportData.lossRate],
      ['总用水量(吨)', exportData.waterUsage]
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const dataBlob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `租户抄表数据_${formData.month}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 打印页面
  const printPage = () => {
    window.print()
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">租户抄表管理</h1>
          <p className="text-gray-600 mt-1">录入持睿汽车的水电表抄表数据</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadTemplate} variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            导入模板下载
          </Button>
          <Button onClick={() => document.getElementById('import-file').click()} variant="outline" size="sm">
            <FileUp className="w-4 h-4 mr-2" />
            导入数据
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".xlsx,.csv,.json"
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

      {/* 抄表数据录入 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            抄表数据录入
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="month">抄表月份</Label>
              <Input
                id="month"
                type="month"
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="multiplier">电表倍率</Label>
              <Input
                id="multiplier"
                type="number"
                value={formData.multiplier}
                onChange={(e) => handleInputChange('multiplier', parseInt(e.target.value) || 200)}
              />
            </div>
          </div>

          {/* 电表1分时段读数 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              电表分时段度数
            </h3>
            
            <div className="space-y-4">
              {/* 尖峰时段 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>尖峰时段</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>起度</Label>
                      <Input
                        placeholder="输入起度"
                        value={formData.electricMeter1Peak.start}
                        onChange={(e) => handleInputChange('electricMeter1Peak.start', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>止度</Label>
                      <Input
                        placeholder="输入止度"
                        value={formData.electricMeter1Peak.end}
                        onChange={(e) => handleInputChange('electricMeter1Peak.end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 高峰时段 */}
                <div>
                  <Label>高峰时段</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>起度</Label>
                      <Input
                        placeholder="输入起度"
                        value={formData.electricMeter1High.start}
                        onChange={(e) => handleInputChange('electricMeter1High.start', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>止度</Label>
                      <Input
                        placeholder="输入止度"
                        value={formData.electricMeter1High.end}
                        onChange={(e) => handleInputChange('electricMeter1High.end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 平峰时段 */}
                <div>
                  <Label>平峰时段</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>起度</Label>
                      <Input
                        placeholder="输入起度"
                        value={formData.electricMeter1Normal.start}
                        onChange={(e) => handleInputChange('electricMeter1Normal.start', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>止度</Label>
                      <Input
                        placeholder="输入止度"
                        value={formData.electricMeter1Normal.end}
                        onChange={(e) => handleInputChange('electricMeter1Normal.end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 低谷时段 */}
                <div>
                  <Label>低谷时段</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>起度</Label>
                      <Input
                        placeholder="输入起度"
                        value={formData.electricMeter1Valley.start}
                        onChange={(e) => handleInputChange('electricMeter1Valley.start', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>止度</Label>
                      <Input
                        placeholder="输入止度"
                        value={formData.electricMeter1Valley.end}
                        onChange={(e) => handleInputChange('electricMeter1Valley.end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 星达总表 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">星达总表</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalStart">星达总表起度</Label>
                <Input
                  id="totalStart"
                  placeholder="输入起度"
                  value={formData.totalMeterStart}
                  onChange={(e) => handleInputChange('totalMeterStart', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="totalEnd">星达总表止度</Label>
                <Input
                  id="totalEnd"
                  placeholder="输入止度"
                  value={formData.totalMeterEnd}
                  onChange={(e) => handleInputChange('totalMeterEnd', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 水表读数 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              水表读数
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="water1Start">水表1起度</Label>
                  <Input
                    id="water1Start"
                    placeholder="输入起度"
                    value={formData.waterMeter1Start}
                    onChange={(e) => handleInputChange('waterMeter1Start', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="water1End">水表1止度</Label>
                  <Input
                    id="water1End"
                    placeholder="输入止度"
                    value={formData.waterMeter1End}
                    onChange={(e) => handleInputChange('waterMeter1End', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="water2Start">水表2起度</Label>
                  <Input
                    id="water2Start"
                    placeholder="输入起度"
                    value={formData.waterMeter2Start}
                    onChange={(e) => handleInputChange('waterMeter2Start', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="water2End">水表2止度</Label>
                  <Input
                    id="water2End"
                    placeholder="输入止度"
                    value={formData.waterMeter2End}
                    onChange={(e) => handleInputChange('waterMeter2End', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <Button onClick={saveToHistory} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              保存数据
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 计算结果 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            计算结果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{calculated.peakUsage.toLocaleString()}</div>
              <div className="text-sm text-gray-600">尖峰用电量 (度)</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{calculated.highUsage.toLocaleString()}</div>
              <div className="text-sm text-gray-600">高峰用电量 (度)</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{calculated.normalUsage.toLocaleString()}</div>
              <div className="text-sm text-gray-600">平峰用电量 (度)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{calculated.valleyUsage.toLocaleString()}</div>
              <div className="text-sm text-gray-600">低谷用电量 (度)</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{calculated.actualElectricity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">实际用电量 (度)</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{calculated.totalElectricity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">星达总表电量（度）</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{calculated.lossElectricity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">损耗电量 (度)</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{calculated.waterUsage.toLocaleString()}</div>
              <div className="text-sm text-gray-600">总用水量 (吨)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 历史记录 */}
      <Card>
        <CardHeader>
          <CardTitle>历史记录</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无历史记录
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>月份</TableHead>
                  <TableHead>实际用电量(度)</TableHead>
                  <TableHead>星达总表电量(度)</TableHead>
                  <TableHead>损耗电量(度)</TableHead>
                  <TableHead>损耗率(%)</TableHead>
                  <TableHead>总用水量(吨)</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow 
                    key={record.id}
                    className={selectedHistoryId === record.id ? 'bg-blue-50' : 'cursor-pointer hover:bg-gray-50'}
                    onClick={() => selectHistoryRecord(record)}
                  >
                    <TableCell>{record.month}</TableCell>
                    <TableCell>{record.actualElectricity?.toLocaleString() || 0}</TableCell>
                    <TableCell>{record.totalElectricity?.toLocaleString() || 0}</TableCell>
                    <TableCell>{record.lossElectricity?.toLocaleString() || 0}</TableCell>
                    <TableCell>{record.lossRate?.toFixed(2) || 0}%</TableCell>
                    <TableCell>{record.waterUsage?.toLocaleString() || 0}</TableCell>
                    <TableCell>{new Date(record.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteHistoryRecord(record.id)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MeterReading
