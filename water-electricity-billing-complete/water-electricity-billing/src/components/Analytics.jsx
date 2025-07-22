import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Zap,
  Droplets,
  DollarSign,
  PieChart
} from 'lucide-react'

const Analytics = () => {
  // 模拟历史数据
  const [monthlyData] = useState([
    { month: '2025-01', electricity: 148000, water: 174, electricityFee: 107280, waterFee: 908.28, lossRate: 3.1 },
    { month: '2025-02', electricity: 80000, water: 111, electricityFee: 58080, waterFee: 579.42, lossRate: 2.4 },
    { month: '2025-03', electricity: 143400, water: 191, electricityFee: 104089, waterFee: 996.02, lossRate: 2.5 },
    { month: '2025-04', electricity: 98000, water: 173, electricityFee: 71176, waterFee: 902.06, lossRate: 2.4 },
    { month: '2025-05', electricity: 105800, water: 190, electricityFee: 76821, waterFee: 991.8, lossRate: 2.6 },
    { month: '2025-06', electricity: 146400, water: 248, electricityFee: 106329, waterFee: 1294.56, lossRate: 2.9 }
  ])

  const [timeOfUseData] = useState([
    { period: '尖峰', percentage: 7.6, color: 'bg-red-500' },
    { period: '高峰', percentage: 23.01, color: 'bg-orange-500' },
    { period: '平段', percentage: 31.96, color: 'bg-yellow-500' },
    { period: '低谷', percentage: 37.43, color: 'bg-green-500' }
  ])

  // 计算统计数据
  const totalElectricity = monthlyData.reduce((sum, item) => sum + item.electricity, 0)
  const totalWater = monthlyData.reduce((sum, item) => sum + item.water, 0)
  const totalElectricityFee = monthlyData.reduce((sum, item) => sum + item.electricityFee, 0)
  const totalWaterFee = monthlyData.reduce((sum, item) => sum + item.waterFee, 0)
  const avgLossRate = monthlyData.reduce((sum, item) => sum + item.lossRate, 0) / monthlyData.length

  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  
  const electricityGrowth = ((currentMonth.electricity - previousMonth.electricity) / previousMonth.electricity) * 100
  const waterGrowth = ((currentMonth.water - previousMonth.water) / previousMonth.water) * 100
  const feeGrowth = ((currentMonth.electricityFee - previousMonth.electricityFee) / previousMonth.electricityFee) * 100

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">数据分析</h2>
        <p className="text-gray-600 mt-1">用电趋势分析与费用统计报告</p>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">本月用电量</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentMonth.electricity.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">度</p>
              </div>
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {electricityGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${electricityGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(electricityGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 上月</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">本月用水量</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {currentMonth.water.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">吨</p>
              </div>
              <div className="flex items-center">
                <Droplets className="h-8 w-8 text-cyan-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {waterGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${waterGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(waterGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 上月</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">本月电费</p>
                <p className="text-2xl font-bold text-green-600">
                  ¥{currentMonth.electricityFee.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">元</p>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {feeGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${feeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(feeGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 上月</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均损耗率</p>
                <p className="text-2xl font-bold text-purple-600">
                  {avgLossRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">半年平均</p>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant={avgLossRate > 3 ? "destructive" : "secondary"}>
                {avgLossRate > 3 ? "偏高" : "正常"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="time-of-use">分时用电</TabsTrigger>
          <TabsTrigger value="summary">统计汇总</TabsTrigger>
        </TabsList>

        {/* 趋势分析 */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 用电量趋势 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  用电量趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.electricity / Math.max(...monthlyData.map(d => d.electricity))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">
                          {item.electricity.toLocaleString()}度
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 用水量趋势 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2" />
                  用水量趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-cyan-600 h-2 rounded-full" 
                            style={{ width: `${(item.water / Math.max(...monthlyData.map(d => d.water))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {item.water}吨
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 电费趋势 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  电费趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(item.electricityFee / Math.max(...monthlyData.map(d => d.electricityFee))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">
                          ¥{item.electricityFee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 损耗率趋势 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  损耗率趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.lossRate > 3 ? 'bg-red-600' : 'bg-purple-600'}`}
                            style={{ width: `${(item.lossRate / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {item.lossRate}%
                        </span>
                        <Badge variant={item.lossRate > 3 ? "destructive" : "secondary"} className="text-xs">
                          {item.lossRate > 3 ? "高" : "正常"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 分时用电 */}
        <TabsContent value="time-of-use">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 分时用电占比 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  分时用电占比
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeOfUseData.map((item, index) => (
                    <div key={item.period} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${item.color}`} />
                        <span className="text-sm font-medium">{item.period}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-12 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 分时电价建议 */}
            <Card>
              <CardHeader>
                <CardTitle>用电优化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">低谷时段利用率高</h4>
                    <p className="text-sm text-green-700">
                      低谷时段用电占比37.43%，充分利用了低价电时段，有效控制了电费成本。
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">平段用电合理</h4>
                    <p className="text-sm text-blue-700">
                      平段用电占比31.96%，用电时间分布较为均衡。
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">高峰时段可优化</h4>
                    <p className="text-sm text-orange-700">
                      高峰时段用电占比23.01%，建议将部分非紧急用电需求调整到低谷时段。
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">尖峰时段控制良好</h4>
                    <p className="text-sm text-red-700">
                      尖峰时段用电占比仅7.6%，有效避免了最高电价时段的用电。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 统计汇总 */}
        <TabsContent value="summary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 半年汇总 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  半年度汇总统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                    <span>总用电量</span>
                    <span className="font-bold text-blue-600">
                      {totalElectricity.toLocaleString()} 度
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-md">
                    <span>总用水量</span>
                    <span className="font-bold text-cyan-600">
                      {totalWater.toLocaleString()} 吨
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <span>总电费</span>
                    <span className="font-bold text-green-600">
                      ¥{totalElectricityFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-md">
                    <span>总水费</span>
                    <span className="font-bold text-purple-600">
                      ¥{totalWaterFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span>平均月用电量</span>
                    <span className="font-bold text-gray-600">
                      {Math.round(totalElectricity / monthlyData.length).toLocaleString()} 度
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span>平均月电费</span>
                    <span className="font-bold text-gray-600">
                      ¥{Math.round(totalElectricityFee / monthlyData.length).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 效率指标 */}
            <Card>
              <CardHeader>
                <CardTitle>效率指标分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">平均电价</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ¥{(totalElectricityFee / totalElectricity).toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-600">元/度</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">平均水价</h4>
                    <p className="text-2xl font-bold text-cyan-600">
                      ¥{(totalWaterFee / totalWater).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">元/吨</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">电水费比例</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {((totalElectricityFee / (totalElectricityFee + totalWaterFee)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">电费占比</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">损耗控制</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {avgLossRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">平均损耗率</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Analytics

