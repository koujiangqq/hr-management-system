import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  PieChart, 
  Save, 
  Download,
  Zap,
  DollarSign,
  BarChart3,
  Upload,
  Printer
} from 'lucide-react'

const BillingAllocation = () => {
  // 分时电费统计数据
  const [timeBasedBilling, setTimeBasedBilling] = useState({
    // 工业电费
    industrial: {
      peak: { startReading: 898.07, endReading: 916.07, multiplier: 3000, usage: 0, adjustElectricity: -1351, lineLoss: 27, billingElectricity: 0, transmissionPrice: 0.24464, transmissionFee: 0, purchasePrice: 0.72059, purchaseFee: 0 },
      high: { startReading: 2763.54, endReading: 2818.05, multiplier: 3000, usage: 0, adjustElectricity: -4189, lineLoss: 82, billingElectricity: 0, transmissionPrice: 0.24464, transmissionFee: 0, purchasePrice: 0.72059, purchaseFee: 0 },
      normal: { startReading: 3832.94, endReading: 3908.63, multiplier: 3000, usage: 0, adjustElectricity: -5345, lineLoss: 115, billingElectricity: 0, transmissionPrice: 0.1529, transmissionFee: 0, purchasePrice: 0.43618, purchaseFee: 0 },
      valley: { startReading: 4256.58, endReading: 4345.27, multiplier: 3000, usage: 0, adjustElectricity: -3381, lineLoss: 136, billingElectricity: 0, transmissionPrice: 0.058102, transmissionFee: 0, purchasePrice: 0.16751, purchaseFee: 0 }
    },
    // 居民电费
    residential: {
      directoryFee: { startReading: 4797.19, endReading: 4940.75, multiplier: 100, usage: 0, adjustElectricity: 0, lineLoss: 7, billingElectricity: 0, transmissionPrice: 0, transmissionFee: 0, purchasePrice: 0.507031, purchaseFee: 0 },
      governmentFund: { startReading: 4797.19, endReading: 4940.75, multiplier: 100, usage: 0, adjustElectricity: 0, lineLoss: 7, billingElectricity: 0, transmissionPrice: 0, transmissionFee: 0, purchasePrice: 0.022969, purchaseFee: 0 }
    },
    // 其他费用
    other: {
      transmissionCapacity: { amount: 44000 },
      retailLossSharing: { rate: 0.000853, amount: 0 },
      gridLineLoss: { rate: 0.018666, amount: 0 },
      systemOperation: { rate: 0.038355, amount: 0 },
      governmentFund: { rate: 0.047694, amount: 0 },
      powerFactorAdjustment: { amount: -3446.15 }
    }
  })

  // 账单基础信息
  const [billInfo, setBillInfo] = useState({
    billingPeriod: '2025-6-1至2025-6-30',
    accountNumber: '5001654065328',
    accountName: '重庆星达铜业有限公司',
    totalUsage: 0,
    totalBillingElectricity: 0,
    residentialUsage: 0,
    totalFee: 0,
    averagePrice: 0
  })

  // 费用构成明细
  const [feeBreakdown, setFeeBreakdown] = useState({
    purchaseElectricityFee: 0,
    gridLineLossFee: 0,
    transmissionFee: 0,
    systemOperationFee: 0,
    governmentFundFee: 0,
    residentialElectricityFee: 0,
    powerFactorAdjustmentFee: 0
  })

  // 历史记录
  const [billingHistory, setBillingHistory] = useState([])

  // 组件加载时从localStorage读取数据
  useEffect(() => {
    const savedTimeBasedBilling = localStorage.getItem('timeBasedBilling')
    const savedBillInfo = localStorage.getItem('billInfo')
    const savedFeeBreakdown = localStorage.getItem('feeBreakdown')
    const savedBillingHistory = localStorage.getItem('billingHistory')
    
    if (savedTimeBasedBilling) {
      setTimeBasedBilling(JSON.parse(savedTimeBasedBilling))
    }
    
    if (savedBillInfo) {
      setBillInfo(JSON.parse(savedBillInfo))
    }
    
    if (savedFeeBreakdown) {
      setFeeBreakdown(JSON.parse(savedFeeBreakdown))
    }
    
    if (savedBillingHistory) {
      setBillingHistory(JSON.parse(savedBillingHistory))
    }
  }, [])

  // 计算使用电量
  const calculateUsage = (startReading, endReading, multiplier) => {
    return (endReading - startReading) * multiplier
  }

  // 计算计费电量
  const calculateBillingElectricity = (usage, adjustElectricity, lineLoss) => {
    return usage + adjustElectricity + lineLoss
  }

  // 计算费用
  const calculateFee = (billingElectricity, price) => {
    return billingElectricity * price
  }

  // 自动计算所有数据
  useEffect(() => {
    const updatedTimeBasedBilling = { ...timeBasedBilling }
    
    // 计算工业电费
    Object.keys(updatedTimeBasedBilling.industrial).forEach(period => {
      const data = updatedTimeBasedBilling.industrial[period]
      data.usage = calculateUsage(data.startReading, data.endReading, data.multiplier)
      data.billingElectricity = calculateBillingElectricity(data.usage, data.adjustElectricity, data.lineLoss)
      data.transmissionFee = calculateFee(data.billingElectricity, data.transmissionPrice)
      data.purchaseFee = calculateFee(data.billingElectricity, data.purchasePrice)
    })

    // 计算居民电费
    Object.keys(updatedTimeBasedBilling.residential).forEach(type => {
      const data = updatedTimeBasedBilling.residential[type]
      data.usage = calculateUsage(data.startReading, data.endReading, data.multiplier)
      data.billingElectricity = calculateBillingElectricity(data.usage, data.adjustElectricity, data.lineLoss)
      data.purchaseFee = calculateFee(data.billingElectricity, data.purchasePrice)
    })

    // 计算总用电量
    const totalUsage = Object.values(updatedTimeBasedBilling.industrial).reduce((sum, data) => sum + data.usage, 0) +
                      Object.values(updatedTimeBasedBilling.residential).reduce((sum, data) => sum + data.usage, 0)
    
    const totalBillingElectricity = Object.values(updatedTimeBasedBilling.industrial).reduce((sum, data) => sum + data.billingElectricity, 0) +
                                   Object.values(updatedTimeBasedBilling.residential).reduce((sum, data) => sum + data.billingElectricity, 0)

    const residentialUsage = Object.values(updatedTimeBasedBilling.residential).reduce((sum, data) => sum + data.billingElectricity, 0)

    // 计算其他费用
    updatedTimeBasedBilling.other.retailLossSharing.amount = totalBillingElectricity * updatedTimeBasedBilling.other.retailLossSharing.rate
    updatedTimeBasedBilling.other.gridLineLoss.amount = totalBillingElectricity * updatedTimeBasedBilling.other.gridLineLoss.rate
    updatedTimeBasedBilling.other.systemOperation.amount = totalBillingElectricity * updatedTimeBasedBilling.other.systemOperation.rate
    updatedTimeBasedBilling.other.governmentFund.amount = totalBillingElectricity * updatedTimeBasedBilling.other.governmentFund.rate

    // 计算费用构成明细
    const newFeeBreakdown = {
      purchaseElectricityFee: Object.values(updatedTimeBasedBilling.industrial).reduce((sum, data) => sum + data.purchaseFee, 0) +
                             Object.values(updatedTimeBasedBilling.residential).reduce((sum, data) => sum + data.purchaseFee, 0) +
                             updatedTimeBasedBilling.other.retailLossSharing.amount,
      gridLineLossFee: updatedTimeBasedBilling.other.gridLineLoss.amount,
      transmissionFee: Object.values(updatedTimeBasedBilling.industrial).reduce((sum, data) => sum + data.transmissionFee, 0) +
                      updatedTimeBasedBilling.other.transmissionCapacity.amount,
      systemOperationFee: updatedTimeBasedBilling.other.systemOperation.amount,
      governmentFundFee: updatedTimeBasedBilling.other.governmentFund.amount,
      residentialElectricityFee: Object.values(updatedTimeBasedBilling.residential).reduce((sum, data) => sum + data.purchaseFee, 0),
      powerFactorAdjustmentFee: updatedTimeBasedBilling.other.powerFactorAdjustment.amount
    }

    const totalFee = Object.values(newFeeBreakdown).reduce((sum, fee) => sum + fee, 0)
    const averagePrice = totalBillingElectricity > 0 ? totalFee / totalBillingElectricity : 0

    setTimeBasedBilling(updatedTimeBasedBilling)
    setFeeBreakdown(newFeeBreakdown)
    setBillInfo(prev => ({
      ...prev,
      totalUsage,
      totalBillingElectricity,
      residentialUsage,
      totalFee,
      averagePrice
    }))
  }, [timeBasedBilling.industrial, timeBasedBilling.residential, timeBasedBilling.other])

  // 保存数据到localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('timeBasedBilling', JSON.stringify(timeBasedBilling))
    localStorage.setItem('billInfo', JSON.stringify(billInfo))
    localStorage.setItem('feeBreakdown', JSON.stringify(feeBreakdown))
    localStorage.setItem('billingHistory', JSON.stringify(billingHistory))
  }

  // 处理输入变化
  const handleInputChange = (category, period, field, value) => {
    setTimeBasedBilling(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [period]: {
          ...prev[category][period],
          [field]: parseFloat(value) || 0
        }
      }
    }))
  }

  // 处理其他费用变化
  const handleOtherFeeChange = (type, field, value) => {
    setTimeBasedBilling(prev => ({
      ...prev,
      other: {
        ...prev.other,
        [type]: {
          ...prev.other[type],
          [field]: parseFloat(value) || 0
        }
      }
    }))
  }

  // 保存分时电费统计
  const handleSaveBilling = () => {
    const newRecord = {
      id: Date.now(),
      billingPeriod: billInfo.billingPeriod,
      timeBasedBilling: { ...timeBasedBilling },
      billInfo: { ...billInfo },
      feeBreakdown: { ...feeBreakdown },
      createdAt: new Date().toISOString()
    }
    
    const updatedHistory = [newRecord, ...billingHistory]
    setBillingHistory(updatedHistory)
    localStorage.setItem('billingHistory', JSON.stringify(updatedHistory))
    saveToLocalStorage()
    alert('分时电费统计已保存')
  }

  // 导入模板下载
  const handleDownloadTemplate = () => {
    const template = {
      industrial: {
        peak: { startReading: 0, endReading: 0, multiplier: 3000, adjustElectricity: 0, lineLoss: 0, transmissionPrice: 0.24464, purchasePrice: 0.72059 },
        high: { startReading: 0, endReading: 0, multiplier: 3000, adjustElectricity: 0, lineLoss: 0, transmissionPrice: 0.24464, purchasePrice: 0.72059 },
        normal: { startReading: 0, endReading: 0, multiplier: 3000, adjustElectricity: 0, lineLoss: 0, transmissionPrice: 0.1529, purchasePrice: 0.43618 },
        valley: { startReading: 0, endReading: 0, multiplier: 3000, adjustElectricity: 0, lineLoss: 0, transmissionPrice: 0.058102, purchasePrice: 0.16751 }
      },
      residential: {
        directoryFee: { startReading: 0, endReading: 0, multiplier: 100, adjustElectricity: 0, lineLoss: 0, purchasePrice: 0.507031 },
        governmentFund: { startReading: 0, endReading: 0, multiplier: 100, adjustElectricity: 0, lineLoss: 0, purchasePrice: 0.022969 }
      }
    }
    
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = '分时电费统计模板.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  // 导出数据
  const handleExportData = () => {
    const exportData = {
      timeBasedBilling,
      billInfo,
      feeBreakdown,
      exportTime: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `分时电费统计_${billInfo.billingPeriod}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 打印页面
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">电费核算分摊</h2>
          <p className="text-gray-600 mt-1">分时电费统计与费用核算</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleDownloadTemplate} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导入模板下载
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            导入数据
          </Button>
          <Button onClick={handleExportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出数据
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            打印
          </Button>
        </div>
      </div>

      <Tabs defaultValue="time-based-billing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="time-based-billing">分时电费统计</TabsTrigger>
          <TabsTrigger value="fee-breakdown">费用构成明细</TabsTrigger>
          <TabsTrigger value="bill-info">账单基础信息</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        {/* 分时电费统计 */}
        <TabsContent value="time-based-billing">
          <div className="space-y-6">
            {/* 工业电费 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  工业电费
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时段</TableHead>
                      <TableHead>起度</TableHead>
                      <TableHead>止度</TableHead>
                      <TableHead>倍率</TableHead>
                      <TableHead>使用电量</TableHead>
                      <TableHead>加减电量</TableHead>
                      <TableHead>线路损耗</TableHead>
                      <TableHead>计费电量</TableHead>
                      <TableHead>输配电单价</TableHead>
                      <TableHead>输配电费</TableHead>
                      <TableHead>购电单价</TableHead>
                      <TableHead>购电电费</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(timeBasedBilling.industrial).map(([period, data]) => (
                      <TableRow key={period}>
                        <TableCell className="font-medium">
                          {period === 'peak' ? '尖峰' : period === 'high' ? '高峰' : period === 'normal' ? '平段' : '谷段'}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={data.startReading}
                            onChange={(e) => handleInputChange('industrial', period, 'startReading', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={data.endReading}
                            onChange={(e) => handleInputChange('industrial', period, 'endReading', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={data.multiplier}
                            onChange={(e) => handleInputChange('industrial', period, 'multiplier', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{data.usage.toLocaleString()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={data.adjustElectricity}
                            onChange={(e) => handleInputChange('industrial', period, 'adjustElectricity', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={data.lineLoss}
                            onChange={(e) => handleInputChange('industrial', period, 'lineLoss', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{data.billingElectricity.toLocaleString()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.00001"
                            value={data.transmissionPrice}
                            onChange={(e) => handleInputChange('industrial', period, 'transmissionPrice', e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">¥{data.transmissionFee.toFixed(2)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.00001"
                            value={data.purchasePrice}
                            onChange={(e) => handleInputChange('industrial', period, 'purchasePrice', e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">¥{data.purchaseFee.toFixed(2)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 居民电费 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  居民电费
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>类型</TableHead>
                      <TableHead>起度</TableHead>
                      <TableHead>止度</TableHead>
                      <TableHead>倍率</TableHead>
                      <TableHead>使用电量</TableHead>
                      <TableHead>加减电量</TableHead>
                      <TableHead>线路损耗</TableHead>
                      <TableHead>计费电量</TableHead>
                      <TableHead>购电单价</TableHead>
                      <TableHead>购电电费</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(timeBasedBilling.residential).map(([type, data]) => (
                      <TableRow key={type}>
                        <TableCell className="font-medium">
                          {type === 'directoryFee' ? '目录电费' : '政府基金及附加'}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={data.startReading}
                            onChange={(e) => handleInputChange('residential', type, 'startReading', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={data.endReading}
                            onChange={(e) => handleInputChange('residential', type, 'endReading', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={data.multiplier}
                            onChange={(e) => handleInputChange('residential', type, 'multiplier', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{data.usage.toLocaleString()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={data.adjustElectricity}
                            onChange={(e) => handleInputChange('residential', type, 'adjustElectricity', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={data.lineLoss}
                            onChange={(e) => handleInputChange('residential', type, 'lineLoss', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{data.billingElectricity.toLocaleString()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.00001"
                            value={data.purchasePrice}
                            onChange={(e) => handleInputChange('residential', type, 'purchasePrice', e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">¥{data.purchaseFee.toFixed(2)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 其他费用 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  其他费用
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>输配容量电费 (元)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={timeBasedBilling.other.transmissionCapacity.amount}
                      onChange={(e) => handleOtherFeeChange('transmissionCapacity', 'amount', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>零售损益分摊费率</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={timeBasedBilling.other.retailLossSharing.rate}
                      onChange={(e) => handleOtherFeeChange('retailLossSharing', 'rate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>上网环节线损费用费率</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={timeBasedBilling.other.gridLineLoss.rate}
                      onChange={(e) => handleOtherFeeChange('gridLineLoss', 'rate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>系统运行费费率</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={timeBasedBilling.other.systemOperation.rate}
                      onChange={(e) => handleOtherFeeChange('systemOperation', 'rate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>政府基金及附加费率</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={timeBasedBilling.other.governmentFund.rate}
                      onChange={(e) => handleOtherFeeChange('governmentFund', 'rate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>功率因素调整电费 (元)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={timeBasedBilling.other.powerFactorAdjustment.amount}
                      onChange={(e) => handleOtherFeeChange('powerFactorAdjustment', 'amount', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 保存按钮 */}
            <div className="flex justify-center">
              <Button onClick={handleSaveBilling} size="lg">
                <Save className="h-4 w-4 mr-2" />
                保存分时电费统计
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* 费用构成明细 */}
        <TabsContent value="fee-breakdown">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                费用构成明细
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>序号</TableHead>
                    <TableHead>费用项目</TableHead>
                    <TableHead>金额 (元)</TableHead>
                    <TableHead>占比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>购电电费</TableCell>
                    <TableCell>¥{feeBreakdown.purchaseElectricityFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {billInfo.totalFee > 0 ? ((feeBreakdown.purchaseElectricityFee / billInfo.totalFee) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>上网环节线损费用</TableCell>
                    <TableCell>¥{feeBreakdown.gridLineLossFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {billInfo.totalFee > 0 ? ((feeBreakdown.gridLineLossFee / billInfo.totalFee) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3</TableCell>
                    <TableCell>输配电费</TableCell>
                    <TableCell>¥{feeBreakdown.transmissionFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {billInfo.totalFee > 0 ? ((feeBreakdown.transmissionFee / billInfo.totalFee) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>4</TableCell>
                    <TableCell>系统运行费</TableCell>
                    <TableCell>¥{feeBreakdown.systemOperationFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {billInfo.totalFee > 0 ? ((feeBreakdown.systemOperationFee / billInfo.totalFee) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>5</TableCell>
                    <TableCell>政府基金及附加</TableCell>
                    <TableCell>¥{feeBreakdown.governmentFundFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {billInfo.totalFee > 0 ? ((feeBreakdown.governmentFundFee / billInfo.totalFee) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6</TableCell>
                    <TableCell>居民电费</TableCell>
                    <TableCell>¥{feeBreakdown.residentialElectricityFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {billInfo.totalFee > 0 ? ((feeBreakdown.residentialElectricityFee / billInfo.totalFee) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>7</TableCell>
                    <TableCell>功率因素调整电费</TableCell>
                    <TableCell>¥{feeBreakdown.powerFactorAdjustmentFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {billInfo.totalFee > 0 ? ((feeBreakdown.powerFactorAdjustmentFee / billInfo.totalFee) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell>合计</TableCell>
                    <TableCell>总电费</TableCell>
                    <TableCell className="text-red-600">¥{billInfo.totalFee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge>100%</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 账单基础信息 */}
        <TabsContent value="bill-info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                账单基础信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>账单周期</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <Input
                      value={billInfo.billingPeriod}
                      onChange={(e) => setBillInfo(prev => ({ ...prev, billingPeriod: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>户号</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <Input
                      value={billInfo.accountNumber}
                      onChange={(e) => setBillInfo(prev => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>户名</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <Input
                      value={billInfo.accountName}
                      onChange={(e) => setBillInfo(prev => ({ ...prev, accountName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>使用电量 (度)</Label>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="text-2xl font-bold text-blue-600">
                      {billInfo.totalUsage.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>计费电量 (度)</Label>
                  <div className="p-3 bg-green-50 rounded-md">
                    <div className="text-2xl font-bold text-green-600">
                      {billInfo.totalBillingElectricity.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>居民用电 (度)</Label>
                  <div className="p-3 bg-purple-50 rounded-md">
                    <div className="text-2xl font-bold text-purple-600">
                      {billInfo.residentialUsage.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>总电费 (元)</Label>
                  <div className="p-3 bg-red-50 rounded-md">
                    <div className="text-2xl font-bold text-red-600">
                      ¥{billInfo.totalFee.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>平均电单价 (元/度)</Label>
                  <div className="p-3 bg-orange-50 rounded-md">
                    <div className="text-2xl font-bold text-orange-600">
                      ¥{billInfo.averagePrice.toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 历史记录 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>分时电费统计历史记录</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>账单周期</TableHead>
                    <TableHead>总电费 (元)</TableHead>
                    <TableHead>使用电量 (度)</TableHead>
                    <TableHead>计费电量 (度)</TableHead>
                    <TableHead>平均电价 (元/度)</TableHead>
                    <TableHead>创建时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.billingPeriod}</TableCell>
                      <TableCell className="font-bold text-red-600">
                        ¥{record.billInfo.totalFee.toFixed(2)}
                      </TableCell>
                      <TableCell>{record.billInfo.totalUsage.toLocaleString()}</TableCell>
                      <TableCell>{record.billInfo.totalBillingElectricity.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          ¥{record.billInfo.averagePrice.toFixed(6)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(record.createdAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BillingAllocation

