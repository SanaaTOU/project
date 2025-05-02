import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { getRecommendationForProduct } = useProducts();
  const recommendation = getRecommendationForProduct(product.id);
  
  const daysToExpiry = differenceInDays(parseISO(product.expiryDate), new Date());
  const stockDuration = product.usageRate > 0 ? Math.floor(product.quantity / product.usageRate) : 999;
  
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
            </div>
            <StatusBadge status={product.status} />
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="font-medium">{product.quantity} units</p>
            </div>
            <div>
              <p className="text-gray-500">Monthly Usage</p>
              <p className="font-medium">{product.usageRate} units</p>
            </div>
            <div>
              <p className="text-gray-500">Expires in</p>
              <p className={`font-medium ${daysToExpiry < 30 ? 'text-danger-600' : ''}`}>
                {daysToExpiry} days
              </p>
            </div>
            <div>
              <p className="text-gray-500">Stock Duration</p>
              <p className={`font-medium ${stockDuration < 30 ? 'text-warning-600' : ''}`}>
                {stockDuration} days
              </p>
            </div>
          </div>
          
          {recommendation && (
            <div className={`mt-3 p-2 rounded-md ${
              recommendation.action === 'REORDER' 
                ? 'bg-warning-50 text-warning-800' 
                : 'bg-primary-50 text-primary-800'
            }`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">{recommendation.reason}</p>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Updated: {format(parseISO(product.lastUpdated), 'MMM d, yyyy')}
            </span>
            <span className="text-primary-600 flex items-center">
              View details <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;