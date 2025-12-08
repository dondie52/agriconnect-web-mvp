/**
 * My Requests Page for AgriConnect
 * Shows produce requests posted by buyers
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyRequests } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, PageLoading, EmptyState } from '../components/UI';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlusCircle,
  MapPin,
  Calendar,
  Package,
  Tag
} from 'lucide-react';

const statusConfig = {
  open: { label: 'Open', color: 'bg-green-100 text-green-700', icon: Clock },
  closed: { label: 'Closed', color: 'bg-neutral-100 text-neutral-700', icon: XCircle },
  fulfilled: { label: 'Fulfilled', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
};

const MyRequestsPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: requestsData, isLoading } = useMyRequests({ status: statusFilter || undefined });

  const requests = requestsData?.requests || [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">My Requests</h1>
            <p className="text-neutral-500 mt-1">
              Manage your produce requests
            </p>
          </div>
          <Link
            to="/create-request"
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <PlusCircle size={18} />
            Post New Request
          </Link>
        </div>

        {/* Filters */}
        <Card className="flex flex-wrap gap-2">
          {['', 'open', 'fulfilled', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {status ? statusConfig[status]?.label : 'All Requests'}
            </button>
          ))}
        </Card>

        {/* Requests List */}
        {isLoading ? (
          <PageLoading />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No requests yet"
            description="Post a request to let farmers know what produce you're looking for!"
            action={
              <Link to="/create-request" className="btn-primary">
                Post Request
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => {
              const status = statusConfig[request.status] || statusConfig.open;
              const StatusIcon = status.icon;

              return (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-neutral-800">
                      {request.crop_name}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Package size={16} className="text-neutral-400" />
                      <span>Quantity: <strong>{request.quantity} {request.unit || 'kg'}</strong></span>
                    </div>
                    
                    {request.max_price && (
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Tag size={16} className="text-neutral-400" />
                        <span>Max Price: <strong className="text-primary-600">P{request.max_price}</strong></span>
                      </div>
                    )}

                    {request.region_name && (
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin size={16} className="text-neutral-400" />
                        <span>{request.region_name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-neutral-600">
                      <Calendar size={16} className="text-neutral-400" />
                      <span>Posted: {formatDate(request.created_at)}</span>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-neutral-600">{request.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {request.status === 'open' && (
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <button className="flex-1 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Close
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-primary-50 border border-primary-100">
          <h4 className="font-semibold text-primary-800 mb-2">
            💡 How Requests Work
          </h4>
          <p className="text-primary-700 text-sm">
            Post requests for produce you need. Farmers in your area will see your request
            and can contact you directly with offers. You can close a request once fulfilled
            or if you no longer need it.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default MyRequestsPage;









