import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ArrowLeft, Edit, Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ChartComponent from '../components/ChartComponent';
import { format, parseISO, differenceInDays } from 'date-fns';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getRecommendationForProduct } = useProducts();
  const [showRecommendation, setShowRecommendation] = useState(true);

  const product = getProductById(id || '');
  const recommendation = getRecommendationForProduct(id || '');

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
        >
          Go to Products
        </button>
      </div>
    );
  }

  // Generate sample historical data
  const usageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Usage',
        data: [
          product.usageRate - 0.5,
          product.usageRate,
          product.usageRate + 0.3,
          product.usageRate - 0.2,
          product.usageRate + 0.1,
          product.usageRate,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const daysToExpiry = differenceInDays(parseISO(product.expiryDate), new Date());
  const stockDuration = product.usageRate > 0 ? Math.floor(product.quantity / product.usageRate) : 999;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate('/products')}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Product Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                {product.critical && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                    Critical
                  </span>
                )}
                <StatusBadge status={product.status} />
              </div>
              <p className="text-gray-600 mt-1">{product.category || 'Uncategorized'}</p>
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-danger-700 bg-white hover:bg-gray-50 focus:outline-none">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {recommendation && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div 
                className={`p-4 flex justify-between items-center cursor-pointer ${
                  recommendation.action === 'REORDER' 
                    ? 'bg-warning-50 text-warning-800 border-warning-200' 
                    : 'bg-primary-50 text-primary-800 border-primary-200'
                }`}
                onClick={() => setShowRecommendation(!showRecommendation)}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">AI Recommendation: {recommendation.action.replace('_', ' ')}</span>
                </div>
                {showRecommendation ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {showRecommendation && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700">{recommendation.reason}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Predicted Monthly Usage</p>
                      <p className="text-lg font-medium">{recommendation.predictedUsage} units</p>
                    </div>
                    {recommendation.daysUntilStockout && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Days Until Stockout</p>
                        <p className="text-lg font-medium">{recommendation.daysUntilStockout} days</p>
                      </div>
                    )}
                    {recommendation.daysUntilExpiry && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Days Until Expiry</p>
                        <p className="text-lg font-medium">{recommendation.daysUntilExpiry} days</p>
                      </div>
                    )}
                    {recommendation.suggestedOrderQuantity && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Suggested Order Quantity</p>
                        <p className="text-lg font-medium">{recommendation.suggestedOrderQuantity} units</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Product Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Stock</p>
                  <p className="text-lg font-medium">{product.quantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Usage</p>
                  <p className="text-lg font-medium">{product.usageRate} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className={`text-lg font-medium ${daysToExpiry < 30 ? 'text-danger-600' : ''}`}>
                    {format(parseISO(product.expiryDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Days Until Expiry</p>
                  <p className={`text-lg font-medium ${daysToExpiry < 30 ? 'text-danger-600' : ''}`}>
                    {daysToExpiry} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Duration</p>
                  <p className={`text-lg font-medium ${stockDuration < 30 ? 'text-warning-600' : ''}`}>
                    {stockDuration} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier Location</p>
                  <p className="text-lg font-medium">{product.supplierCountry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p className="text-lg font-medium">{product.deliveryTime} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-lg font-medium">{format(parseISO(product.lastUpdated), 'MMM d, yyyy')}</p>
                </div>
              </div>

              {product.notes && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Notes</h4>
                  <p className="text-gray-600 text-sm p-3 bg-gray-50 rounded-md">{product.notes}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Usage History</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ChartComponent type="line" data={usageData} height={220} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
                Update Inventory
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                Order New Stock
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                Print Label
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;