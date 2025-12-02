/**
 * Buyer Requests Page for AgriConnect
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuyerRequests, useRelevantRequests, useCrops, useRegions } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { 
  Card, 
  Select, 
  PageLoading, 
  EmptyState, 
  StatusBadge,
  Pagination,
  Button 
} from '../components/UI';
import { Search, PlusCircle, Phone, MessageCircle } from 'lucide-react';

const BuyerRequestsPage = () => {
  const { isFarmer, isBuyer } = useAuth();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    crop_id: '',
    region_id: '',
  });
  const [contactInfo, setContactInfo] = useState(null);

  const { data: crops } = useCrops();
  const { data: regions } = useRegions();

  // Call BOTH hooks unconditionally with enabled option
  // Only one will actually fetch based on the user's role
  const relevantRequestsQuery = useRelevantRequests(
    { page, limit: 10 },
    { enabled: isFarmer }
  );
  const buyerRequestsQuery = useBuyerRequests(
    { ...filters, page, limit: 10 },
    { enabled: !isFarmer }
  );

  // Select the appropriate result based on role
  const { data: requestsData, isLoading } = isFarmer 
    ? relevantRequestsQuery 
    : buyerRequestsQuery;

  const cropOptions = crops?.map(c => ({ value: c.id, label: c.name })) || [];
  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];

  const requests = requestsData?.requests || [];
  const totalPages = requestsData?.totalPages || 1;

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">
              {isFarmer ? 'Buyer Requests' : 'All Requests'}
            </h1>
            <p className="text-neutral-500 mt-1">
              {isFarmer 
                ? 'Buyers looking for produce that matches your crops'
                : 'Browse produce requests from buyers'
              }
            </p>
          </div>
          
          {isBuyer && (
            <Link to="/create-request" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle size={20} />
              Post Request
            </Link>
          )}
        </div>

        {/* Filters */}
        {!isFarmer && (
          <Card className="flex flex-col md:flex-row gap-4">
            <Select
              label="Filter by Crop"
              value={filters.crop_id}
              onChange={(e) => setFilters(prev => ({ ...prev, crop_id: e.target.value }))}
              options={cropOptions}
              placeholder="All Crops"
              className="md:w-64"
            />
            <Select
              label="Filter by Region"
              value={filters.region_id}
              onChange={(e) => setFilters(prev => ({ ...prev, region_id: e.target.value }))}
              options={regionOptions}
              placeholder="All Regions"
              className="md:w-64"
            />
          </Card>
        )}

        {/* Requests List */}
        {isLoading ? (
          <PageLoading />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No requests found"
            description={
              isFarmer 
                ? "No buyer requests match your current listings. Create more listings to see relevant requests."
                : "No buyer requests available at the moment."
            }
          />
        ) : (
          <>
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{request.crop_name}</h3>
                        <StatusBadge status={request.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500">Quantity</p>
                          <p className="font-medium">{request.quantity} {request.unit}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">Max Price</p>
                          <p className="font-medium">
                            {request.max_price ? `P${request.max_price}/${request.unit}` : 'Flexible'}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500">Region</p>
                          <p className="font-medium">{request.region_name || 'Any'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">Buyer</p>
                          <p className="font-medium">{request.buyer_name}</p>
                        </div>
                      </div>
                      
                      {request.notes && (
                        <p className="text-neutral-600 text-sm mt-3 italic">
                          "{request.notes}"
                        </p>
                      )}
                    </div>

                    {/* Contact Button (for farmers) */}
                    {isFarmer && request.status === 'open' && (
                      <Button
                        variant="outline"
                        onClick={() => setContactInfo(request)}
                      >
                        <MessageCircle size={18} />
                        Contact Buyer
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

        {/* Contact Modal */}
        {contactInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <h3 className="font-semibold text-lg mb-4">Contact Buyer</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="font-medium">{contactInfo.buyer_name}</p>
                  <p className="text-neutral-500 text-sm">
                    Looking for {contactInfo.quantity} {contactInfo.unit} of {contactInfo.crop_name}
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                  <Phone size={20} className="text-primary-500" />
                  <div>
                    <p className="text-sm text-neutral-500">Phone Number</p>
                    <p className="font-semibold">{contactInfo.buyer_phone}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${contactInfo.buyer_phone}`}
                    className="btn-primary flex-1 text-center"
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${contactInfo.buyer_phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 text-center"
                  >
                    WhatsApp
                  </a>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setContactInfo(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BuyerRequestsPage;
