import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import ChartComponent from '../components/ChartComponent';
import { useProducts } from '../context/ProductContext';
import { usageChartData, expiryChartData, inventoryStatusData } from '../data/mockData';
import { Download } from 'lucide-react';

const Analysis: React.FC = () => {
  const { products, loading } = useProducts();
  const [timeRange, setTimeRange] = useState<string>('6m');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Generate category distribution data
  const categories = products.reduce((acc: Record<string, number>, product) => {
    const category = product.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Inventory Analysis</h1>
        <div className="flex items-center gap-4">
          <div className="relative inline-flex">
            <select
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Usage Trends">
          <ChartComponent type="line" data={usageChartData} height={300} />
        </DashboardCard>
        
        <DashboardCard title="Category Distribution">
          <ChartComponent type="pie" data={categoryData} height={300} />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Expiry Timeline">
          <ChartComponent type="bar" data={expiryChartData} height={300} />
        </DashboardCard>

        <DashboardCard title="Inventory Status">
          <ChartComponent type="doughnut" data={inventoryStatusData} height={300} />
        </DashboardCard>
      </div>

      <DashboardCard title="Critical Products Analysis">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Until Stockout
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ideal Order Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products
                .filter(p => p.critical)
                .map(product => {
                  const daysUntilStockout = product.usageRate > 0 
                    ? Math.floor(product.quantity / product.usageRate * 30) 
                    : 999;
                  
                  const idealOrderDate = new Date();
                  idealOrderDate.setDate(idealOrderDate.getDate() + daysUntilStockout - product.deliveryTime);
                  
                  let riskLevel = 'Low';
                  let riskColor = 'text-success-600';
                  if (daysUntilStockout <= product.deliveryTime) {
                    riskLevel = 'High';
                    riskColor = 'text-danger-600';
                  } else if (daysUntilStockout <= product.deliveryTime * 1.5) {
                    riskLevel = 'Medium';
                    riskColor = 'text-warning-600';
                  }
                  
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.usageRate} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {daysUntilStockout}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {idealOrderDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${riskColor}`}>
                          {riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Analysis;