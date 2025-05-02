import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import DashboardCard from '../components/DashboardCard';
import ChartComponent from '../components/ChartComponent';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertCircle, BarChart2, Clock, TrendingUp, Upload } from 'lucide-react';
import { usageChartData, expiryChartData, inventoryStatusData } from '../data/mockData';
import UploadDataModal from '../components/UploadDataModal';

const Dashboard: React.FC = () => {
  const { products, notifications, recommendations, loading } = useProducts();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const criticalProducts = products.filter((p) => p.critical);
  const lowStockProducts = products.filter((p) => p.status === 'LOW_STOCK');
  const expiringProducts = products.filter((p) => p.status === 'EXPIRING_SOON');
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleUpload = (file: File) => {
    console.log('File uploaded:', file);
    // In a real app, you'd process the file here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Data
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Products" className="border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <BarChart2 className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{products.length}</div>
              <div className="text-sm text-gray-500">Products in inventory</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Critical Products" className="border-l-4 border-danger-500">
          <div className="flex items-center">
            <div className="bg-danger-100 p-3 rounded-full mr-4">
              <AlertCircle className="h-6 w-6 text-danger-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{criticalProducts.length}</div>
              <div className="text-sm text-gray-500">Critical items tracked</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Low Stock" className="border-l-4 border-warning-500">
          <div className="flex items-center">
            <div className="bg-warning-100 p-3 rounded-full mr-4">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{lowStockProducts.length}</div>
              <div className="text-sm text-gray-500">Products to reorder</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Expiring Soon" className="border-l-4 border-danger-500">
          <div className="flex items-center">
            <div className="bg-danger-100 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-danger-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{expiringProducts.length}</div>
              <div className="text-sm text-gray-500">Products expiring soon</div>
            </div>
          </div>
        </DashboardCard>
      </div>
       {/* AI Recommendations */}
       <DashboardCard title="AI Recommendations">
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => {
              const product = products.find(p => p.id === rec.productId);
              return (
                <div key={rec.productId} className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/products/${rec.productId}`)}>
                  <div className={`p-2 rounded-full mr-3 ${
                    rec.action === 'REORDER' 
                      ? 'bg-warning-100 text-warning-700' 
                      : rec.action === 'REDUCE_INVENTORY'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">
                        {product?.name || `Product ${rec.productId}`}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.action === 'REORDER' 
                          ? 'bg-warning-100 text-warning-800' 
                          : rec.action === 'REDUCE_INVENTORY'
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rec.action.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-gray-500">
                      <div>
                        <span>Predicted monthly usage: </span>
                        <span className="font-medium">{rec.predictedUsage} units</span>
                      </div>
                      {rec.daysUntilStockout && (
                        <div>
                          <span>Days until stockout: </span>
                          <span className="font-medium">{rec.daysUntilStockout} days</span>
                        </div>
                      )}
                      {rec.daysUntilExpiry && (
                        <div>
                          <span>Days until expiry: </span>
                          <span className="font-medium">{rec.daysUntilExpiry} days</span>
                        </div>
                      )}
                      {rec.suggestedOrderQuantity && (
                        <div>
                          <span>Suggested order: </span>
                          <span className="font-medium">{rec.suggestedOrderQuantity} units</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">No recommendations at this time.</p>
          )}
        </div>
      </DashboardCard>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Monthly Usage Trends" className="lg:col-span-2">
          <ChartComponent type="line" data={usageChartData} height={250} />
        </DashboardCard>
        
        <DashboardCard title="Inventory Status">
          <ChartComponent type="doughnut" data={inventoryStatusData} height={250} />
        </DashboardCard>
      </div>

     

      {/* Recent Notifications */}
      <DashboardCard title="Recent Notifications">
        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.slice(0, 3).map((notification) => {
              const product = notification.productId 
                ? products.find(p => p.id === notification.productId) 
                : null;
              
              return (
                <div key={notification.id} className="flex items-start p-3 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    {product && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{product.name}</span>
                        <span className="mx-2">•</span>
                        <StatusBadge status={product.status} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">No recent notifications.</p>
          )}
          
          {notifications.length > 3 && (
            <button 
              className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-2"
              onClick={() => navigate('/notifications')}
            >
              View all notifications
            </button>
          )}
        </div>
      </DashboardCard>

      <UploadDataModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Dashboard;