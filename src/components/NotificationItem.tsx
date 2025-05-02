import React from 'react';
import { AlertTriangle, Package, Clock, Bell } from 'lucide-react';
import { Notification } from '../types';
import { format, parseISO } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'EXPIRY':
        return <Clock className="w-5 h-5 text-warning-500" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />;
      case 'REORDER':
        return <Package className="w-5 h-5 text-primary-500" />;
      case 'SYSTEM':
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-primary-50' : ''}`}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
              {notification.message}
            </p>
            {!notification.read && (
              <span className="ml-2 flex-shrink-0 inline-block h-2 w-2 rounded-full bg-primary-600"></span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {format(parseISO(notification.date), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;