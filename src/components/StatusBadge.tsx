import React from 'react';

type StatusType = 'OK' | 'LOW_STOCK' | 'EXPIRING_SOON' | 'OVERSTOCKED';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'OK':
        return 'bg-success-100 text-success-800';
      case 'LOW_STOCK':
        return 'bg-warning-100 text-warning-800';
      case 'EXPIRING_SOON':
        return 'bg-danger-100 text-danger-800';
      case 'OVERSTOCKED':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case 'OK':
        return 'OK';
      case 'LOW_STOCK':
        return 'Low Stock';
      case 'EXPIRING_SOON':
        return 'Expiring Soon';
      case 'OVERSTOCKED':
        return 'Overstocked';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;