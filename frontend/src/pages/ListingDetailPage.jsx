/**
 * Listing Detail Page for AgriConnect
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListing, useCreateOrder } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../api';
import { Layout } from '../components/Layout';
import { 
  Card, 
  PageLoading, 
  Button, 
  Modal, 
  Input, 
  Textarea,
  StatusBadge,
  ProductImage,
  Badge
} from '../components/UI';
import { MapPin, User, Phone, Calendar, ArrowLeft, ShoppingCart, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isBuyer } = useAuth();
  
  const { data: listing, isLoading } = useListing(id);
  const createOrder = useCreateOrder();
  
  const [orderModal, setOrderModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [orderData, setOrderData] = useState({
    quantity: '',
    delivery_preference: 'pickup',
    notes: '',
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return <Layout><PageLoading /></Layout>;
  }

  if (!listing) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-neutral-700">Listing not found</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate('/listings')}
            className="mt-4"
          >
            Back to Listings
          </Button>
        </div>
      </Layout>
    );
  }

  let images = [];
  try {
    // Handle both array and JSON string formats
    if (Array.isArray(listing.images)) {
      images = listing.images;
    } else if (typeof listing.images === 'string') {
      images = JSON.parse(listing.images);
    }
  } catch (e) {
    images = [];
  }
  const isOwner = user?.id === listing.farmer_id;

  const handleOrder = async () => {
    if (!orderData.quantity || orderData.quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    if (parseFloat(orderData.quantity) > listing.quantity) {
      toast.error('Quantity exceeds available stock');
      return;
    }

    try {
      await createOrder.mutateAsync({
        listing_id: parseInt(id),
        quantity: parseFloat(orderData.quantity),
        delivery_preference: orderData.delivery_preference,
        notes: orderData.notes,
      });
      
      toast.success('Order placed successfully!');
      setOrderModal(false);
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  const handleContact = async () => {
    try {
      await analyticsAPI.trackContact(listing.id);
      setContactModal(true);
    } catch (err) {
      setContactModal(true);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <Card className="overflow-hidden">
            <div className="aspect-square -m-6 mb-4">
              <ProductImage
                src={images[currentImageIndex]}
                alt={listing.crop_name}
                className="w-full h-full"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      idx === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${listing.crop_name} ${idx + 1}`}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Details */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge>{listing.crop_category}</Badge>
                  <h1 className="text-2xl font-bold text-neutral-800 mt-2">
                    {listing.crop_name}
                  </h1>
                </div>
                <StatusBadge status={listing.status} />
              </div>

              <div className="text-3xl font-bold text-primary-600 mb-4">
                P{listing.price}
                <span className="text-lg text-neutral-400 font-normal">/{listing.unit}</span>
              </div>

              <div className="space-y-3 text-neutral-600">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-neutral-400" />
                  <span>{listing.quantity} {listing.unit} available</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-neutral-400" />
                  <span>{listing.region_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-neutral-400" />
                  <span>Listed {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {listing.description && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-neutral-600">{listing.description}</p>
                </div>
              )}
            </Card>

            {/* Farmer Info */}
            <Card>
              <h3 className="font-semibold mb-3">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">{listing.farmer_name}</p>
                  <p className="text-sm text-neutral-500">{listing.region_name}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {!isOwner && listing.status === 'active' && (
              <div className="flex gap-3">
                <Button
                  onClick={handleContact}
                  variant="outline"
                  className="flex-1"
                >
                  <MessageCircle size={18} />
                  Contact Farmer
                </Button>
                
                {isBuyer && (
                  <Button
                    onClick={() => setOrderModal(true)}
                    className="flex-1"
                  >
                    <ShoppingCart size={18} />
                    Place Order
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Modal */}
        <Modal
          isOpen={orderModal}
          onClose={() => setOrderModal(false)}
          title="Place Order"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-neutral-600">Item:</span>
                <span className="font-medium">{listing.crop_name}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-neutral-600">Price:</span>
                <span className="font-medium">P{listing.price}/{listing.unit}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-neutral-600">Available:</span>
                <span className="font-medium">{listing.quantity} {listing.unit}</span>
              </div>
            </div>

            <Input
              label="Quantity"
              type="number"
              step="0.1"
              min="0.1"
              max={listing.quantity}
              value={orderData.quantity}
              onChange={(e) => setOrderData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder={`Max ${listing.quantity} ${listing.unit}`}
            />

            <div>
              <label className="label">Delivery Preference</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={orderData.delivery_preference === 'pickup'}
                    onChange={(e) => setOrderData(prev => ({ ...prev, delivery_preference: e.target.value }))}
                  />
                  <span>Pickup</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={orderData.delivery_preference === 'delivery'}
                    onChange={(e) => setOrderData(prev => ({ ...prev, delivery_preference: e.target.value }))}
                  />
                  <span>Delivery</span>
                </label>
              </div>
            </div>

            <Textarea
              label="Notes (Optional)"
              value={orderData.notes}
              onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special requests or instructions..."
              rows={3}
            />

            {orderData.quantity && (
              <div className="p-4 bg-primary-50 rounded-lg">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">
                    P{(parseFloat(orderData.quantity) * listing.price).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOrderModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleOrder}
                loading={createOrder.isPending}
                className="flex-1"
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </Modal>

        {/* Contact Modal */}
        <Modal
          isOpen={contactModal}
          onClose={() => setContactModal(false)}
          title="Contact Farmer"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{listing.farmer_name}</h3>
                <p className="text-neutral-500">{listing.region_name}</p>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-primary-500" />
                <div>
                  <p className="text-sm text-neutral-500">Phone Number</p>
                  <p className="font-semibold">{listing.farmer_phone}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-500">
              You can call or WhatsApp the farmer directly to discuss the produce,
              negotiate prices, or arrange for pickup/delivery.
            </p>

            <div className="flex gap-3">
              <a
                href={`tel:${listing.farmer_phone}`}
                className="btn-primary flex-1 text-center"
              >
                Call
              </a>
              <a
                href={`https://wa.me/${listing.farmer_phone?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default ListingDetailPage;
