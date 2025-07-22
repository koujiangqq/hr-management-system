import { useState } from 'react'
import Layout from './components/Layout'
import MeterReading from './components/MeterReading'
import DormitoryManagement from './components/DormitoryManagement'
import BillingAllocation from './components/BillingAllocation'
import Analytics from './components/Analytics'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('meter-reading')

  const renderContent = () => {
    switch (activeTab) {
      case 'meter-reading':
        return <MeterReading />
      case 'dormitory':
        return <DormitoryManagement />
      case 'billing':
        return <BillingAllocation />
      case 'analytics':
        return <Analytics />
      default:
        return <MeterReading />
    }
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default App
