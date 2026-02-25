import Header from '@/components/Header'
import Card from '@/components/Card'

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <Header 
          title="Dashboard" 
          subtitle="Overview of your metrics and data"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Cards */}
          <Card title="Total Users" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="text-3xl font-bold mt-2">1,234</div>
            <p className="text-blue-100 text-sm mt-1">↑ 12% from last month</p>
          </Card>

          <Card title="Revenue" className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <div className="text-3xl font-bold mt-2">$45,678</div>
            <p className="text-green-100 text-sm mt-1">↑ 8% from last month</p>
          </Card>

          <Card title="Active Sessions" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <div className="text-3xl font-bold mt-2">892</div>
            <p className="text-purple-100 text-sm mt-1">↑ 5% from last hour</p>
          </Card>

          <Card title="Conversion Rate" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <div className="text-3xl font-bold mt-2">3.24%</div>
            <p className="text-orange-100 text-sm mt-1">↑ 0.4% from last week</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recent Activity" description="Latest events and updates">
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                New user registered
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Payment processed
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Report generated
              </li>
            </ul>
          </Card>

          <Card title="Quick Actions" description="Common tasks and shortcuts">
            <div className="flex flex-col gap-2 mt-4">
              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition">
                Create New Project
              </button>
              <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                View Reports
              </button>
              <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Manage Users
              </button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
