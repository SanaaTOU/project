import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Notification, AIRecommendation } from '../types';
import { mockProducts, mockNotifications, mockRecommendations } from '../data/mockData';

interface ProductContextType {
  products: Product[];
  notifications: Notification[];
  recommendations: AIRecommendation[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getRecommendationForProduct: (id: string) => AIRecommendation | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setNotifications(mockNotifications);
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: now,
      lastUpdated: now,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, ...product, lastUpdated: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getRecommendationForProduct = (id: string) => {
    return recommendations.find((r) => r.productId === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        notifications,
        recommendations,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        markNotificationAsRead,
        getProductById,
        getRecommendationForProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};