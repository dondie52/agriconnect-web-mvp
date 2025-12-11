/**
 * Cart Page for AgriConnect
 * Shopping cart with items, quantity editing, and checkout
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem, useCheckout } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { 
  Card, 
  PageLoading, 
  EmptyState, 
  Button, 
  Modal,
  Textarea,
  ProductImage
} from '../components/UI';
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight,
  Package,
  MapPin,
  ShoppingBag,
  Truck,
  Store,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { UPLOAD_URL } from '../api';

// Helper to get image URL
const getImageUrl = (images) => {
  if (!images) return null;
  let imageArray = images;
  if (typeof images === 'string') {
    try {
      imageArray = JSON.parse(images);
    } catch {
      return null;
    }
  }
  if (Array.isArray(imageArray) && imageArray.length > 0) {
    const img = imageArray[0];
    if (img.startsWith('http')) return img;
    return `${UPLOAD_URL}/${img.replace(/^\/?(uploads\/)?/, '')}`;
  }
  return null;
};

const CartPage = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading, refetch } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const checkout = useCheckout();

  const [checkoutModal, setCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    delivery_preference: 'pickup',
    delivery_address: '',
    notes: ''
  });

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const itemCount = cart?.itemCount || 0;

  const handleQuantityChange = async (cartItemId, newQuantity, maxQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(cartItemId);
      return;
    }
    if (newQuantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} units available`);
      return;
    }
    try {
      await updateCartItem.mutateAsync({ id: cartItemId, quantity: newQuantity });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeCartItem.mutateAsync(cartItemId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout.mutateAsync(checkoutData);
      toast.success('Order placed successfully!');
      setCheckoutModal(false);
      navigate('/buyer/my-orders');
    } catch (err) {
      const message = err.response?.data?.message || 'Checkout failed';
      toast.error(message);
      
      // If there are issues with cart items, refetch cart
      if (err.response?.data?.data?.issues) {
        refetch();
      }
    }
  };

  if (isLoading) {
    return <Layout><PageLoading /></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <ShoppingCart className="text-primary-500" />
              Shopping Cart
            </h1>
            <p className="text-neutral-500 mt-1">
              {itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
            </p>
          </div>
          <Link
            to="/listings"
            className="btn-outline flex items-center gap-2 w-fit"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Browse our marketplace and add items to your cart"
            action={
              <Link to="/listings" className="btn-primary">
                Browse Listings
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const imageUrl = getImageUrl(item.images);
                const isUnavailable = item.listing_status !== 'active';
                const isLowStock = item.available_quantity < item.quantity;

                return (
                  <Card key={item.id} className={`${isUnavailable ? 'opacity-60' : ''}`}>
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link to={`/listings/${item.listing_id}`} className="shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-neutral-100">
                          <ProductImage
                            src={imageUrl}
                            alt={item.crop_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link 
                              to={`/listings/${item.listing_id}`}
                              className="font-semibold text-neutral-800 hover:text-primary-600 line-clamp-1"
                            >
                              {item.crop_name}
                            </Link>
                            <p className="text-sm text-neutral-500">{item.crop_category}</p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                          <MapPin size={14} />
                          <span>{item.region_name}</span>
                          <span className="text-neutral-300">•</span>
                          <span>by {item.farmer_name}</span>
                        </div>

                        {/* Warnings */}
                        {isUnavailable && (
                          <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                            <AlertCircle size={14} />
                            <span>This item is no longer available</span>
                          </div>
                        )}
                        {!isUnavailable && isLowStock && (
                          <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm">
                            <AlertCircle size={14} />
                            <span>Only {item.available_quantity} {item.unit} available</span>
                          </div>
                        )}

                        {/* Price & Quantity */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-primary-600">
                              P{parseFloat(item.unit_price).toFixed(2)}
                            </span>
                            <span className="text-sm text-neutral-400">/{item.unit}</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.available_quantity)}
                              disabled={updateCartItem.isPending || isUnavailable}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 
                                       hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.available_quantity)}
                              disabled={updateCartItem.isPending || isUnavailable || item.quantity >= item.available_quantity}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 
                                       hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-2 text-right">
                          <span className="text-sm text-neutral-500">Subtotal: </span>
                          <span className="font-semibold text-neutral-800">
                            P{item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Items ({itemCount})</span>
                    <span>P{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <div className="border-t my-4"></div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">P{totalPrice.toFixed(2)}</span>
                </div>

                <Button
                  onClick={() => setCheckoutModal(true)}
                  disabled={items.some(i => i.listing_status !== 'active')}
                  className="w-full mt-6"
                >
                  <Package size={18} />
                  Proceed to Checkout
                </Button>

                {items.some(i => i.listing_status !== 'active') && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    Please remove unavailable items before checkout
                  </p>
                )}

                <p className="text-xs text-neutral-400 mt-4 text-center">
                  By placing an order, you agree to our Terms of Service
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        <Modal
          isOpen={checkoutModal}
          onClose={() => setCheckoutModal(false)}
          title="Checkout"
          size="md"
        >
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-neutral-600">
                      {item.crop_name} × {item.quantity} {item.unit}
                    </span>
                    <span>P{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary-600">P{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Preference */}
            <div>
              <label className="label">Delivery Preference</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutData(prev => ({ ...prev, delivery_preference: 'pickup' }))}
                  className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center gap-2
                            ${checkoutData.delivery_preference === 'pickup' 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <Store size={24} className={checkoutData.delivery_preference === 'pickup' ? 'text-primary-500' : 'text-neutral-400'} />
                  <span className={checkoutData.delivery_preference === 'pickup' ? 'font-medium text-primary-700' : 'text-neutral-600'}>
                    Pickup
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutData(prev => ({ ...prev, delivery_preference: 'delivery' }))}
                  className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center gap-2
                            ${checkoutData.delivery_preference === 'delivery' 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <Truck size={24} className={checkoutData.delivery_preference === 'delivery' ? 'text-primary-500' : 'text-neutral-400'} />
                  <span className={checkoutData.delivery_preference === 'delivery' ? 'font-medium text-primary-700' : 'text-neutral-600'}>
                    Delivery
                  </span>
                </button>
              </div>
            </div>

            {/* Delivery Address (if delivery selected) */}
            {checkoutData.delivery_preference === 'delivery' && (
              <div>
                <label className="label">Delivery Address</label>
                <Textarea
                  value={checkoutData.delivery_address}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, delivery_address: e.target.value }))}
                  placeholder="Enter your delivery address..."
                  rows={2}
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="label">Order Notes (Optional)</label>
              <Textarea
                value={checkoutData.notes}
                onChange={(e) => setCheckoutData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests or instructions..."
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCheckoutModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckout}
                loading={checkout.isPending}
                className="flex-1"
              >
                Place Order
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default CartPage;
