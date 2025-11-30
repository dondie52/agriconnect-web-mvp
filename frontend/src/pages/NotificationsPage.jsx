/**
 * Notifications Page for AgriConnect
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, PageLoading, EmptyState, Button } from '../components/UI';
import { Bell, Package, Check, ShoppingCart, AlertCircle, Cloud } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { data: notificationsData, isLoading } = useNotifications({ limit: 50 });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markAsRead.mutateAsync(notification.id);
    }

    // Navigate based on type
    if (notification.reference_type === 'order') {
      navigate('/orders');
    } else if (notification.reference_type === 'request') {
      navigate('/buyer-requests');
    }
  };

  const getIcon = (type) => {
    const icons = {
      new_order: Package,
      order_accepted: Check,
      order_rejected: AlertCircle,
      order_completed: Check,
      new_request: ShoppingCart,
      price_update: Bell,
      weather_alert: Cloud,
      system: Bell,
    };
    return icons[type] || Bell;
  };

  const getIconColor = (type) => {
    const colors = {
      new_order: 'text-blue-500 bg-blue-100',
      order_accepted: 'text-green-500 bg-green-100',
      order_rejected: 'text-red-500 bg-red-100',
      order_completed: 'text-green-500 bg-green-100',
      new_request: 'text-purple-500 bg-purple-100',
      price_update: 'text-yellow-500 bg-yellow-100',
      weather_alert: 'text-blue-500 bg-blue-100',
      system: 'text-neutral-500 bg-neutral-100',
    };
    return colors[type] || 'text-neutral-500 bg-neutral-100';
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="text-neutral-500 mt-1">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notifications`
                : 'All caught up!'
              }
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              loading={markAllAsRead.isPending}
            >
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <PageLoading />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You'll receive notifications about orders, requests, and updates here."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);
              
              return (
                <Card
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`cursor-pointer transition-all ${
                    !notification.is_read 
                      ? 'border-l-4 border-l-primary-500 bg-primary-50/30' 
                      : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium ${!notification.is_read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                      
                      <p className="text-neutral-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      
                      <p className="text-neutral-400 text-xs mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
