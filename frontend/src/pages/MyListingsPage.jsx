/**
 * My Listings Page for AgriConnect (Farmer)
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyListings, useDeleteListing } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { 
  Card, 
  PageLoading, 
  EmptyState, 
  StatusBadge,
  Button,
  Modal,
  ProductImage,
  Pagination
} from '../components/UI';
import { PlusCircle, Edit, Trash2, Eye, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const MyListingsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, listing: null });

  const { data: listingsData, isLoading } = useMyListings({ page, limit: 10 });
  const deleteListing = useDeleteListing();

  const listings = listingsData?.listings || [];
  const totalPages = listingsData?.totalPages || 1;

  const handleDelete = async () => {
    if (!deleteModal.listing) return;
    
    try {
      await deleteListing.mutateAsync(deleteModal.listing.id);
      toast.success('Listing deleted successfully');
      setDeleteModal({ open: false, listing: null });
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">My Listings</h1>
            <p className="text-neutral-500 mt-1">
              Manage your produce listings
            </p>
          </div>
          <Link to="/create-listing" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle size={20} />
            Create Listing
          </Link>
        </div>

        {/* Listings */}
        {isLoading ? (
          <PageLoading />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No listings yet"
            description="Create your first listing to start selling your produce."
            action={
              <Link to="/create-listing" className="btn-primary">
                Create Listing
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid gap-4">
              {listings.map((listing) => {
                let images = [];
                try {
                  images = listing.images ? JSON.parse(listing.images) : [];
                } catch (e) {
                  // Handle invalid JSON in images field
                  images = [];
                }
                const firstImage = images[0];
                
                return (
                  <Card key={listing.id} className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-40 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <ProductImage
                        src={firstImage}
                        alt={listing.crop_name}
                        className="w-full h-full"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.crop_name}</h3>
                          <p className="text-neutral-500 text-sm">{listing.region_name}</p>
                        </div>
                        <StatusBadge status={listing.status} />
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <span>
                          <strong className="text-primary-600">P{listing.price}</strong>/{listing.unit}
                        </span>
                        <span>{listing.quantity} {listing.unit} available</span>
                        <span className="flex items-center gap-1 text-neutral-500">
                          <Eye size={14} />
                          {listing.views || 0} views
                        </span>
                      </div>
                      
                      {listing.description && (
                        <p className="mt-2 text-neutral-600 text-sm line-clamp-2">
                          {listing.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 md:justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/edit-listing/${listing.id}`)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModal({ open: true, listing })}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, listing: null })}
          title="Delete Listing"
        >
          <div className="space-y-4">
            <p className="text-neutral-600">
              Are you sure you want to delete <strong>{deleteModal.listing?.crop_name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ open: false, listing: null })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={deleteListing.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default MyListingsPage;
