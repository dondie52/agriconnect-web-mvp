/**
 * Cart Context for AgriConnect
 * Manages shopping cart state throughout the app
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isBuyer } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from server
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isBuyer) {
      setCart({ items: [], totalItems: 0, totalPrice: 0, itemCount: 0 });
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isBuyer]);

  // Load cart on auth change
  useEffect(() => {
    if (isAuthenticated && isBuyer) {
      fetchCart();
    } else {
      setCart({ items: [], totalItems: 0, totalPrice: 0, itemCount: 0 });
    }
  }, [isAuthenticated, isBuyer, fetchCart]);

  // Add item to cart
  const addToCart = useCallback(async (listingId, quantity) => {
    try {
      setLoading(true);
      await cartAPI.addItem({ listing_id: listingId, quantity });
      await fetchCart();
      toast.success('Added to cart!');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Update item quantity
  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      setLoading(true);
      await cartAPI.updateItem(cartItemId, quantity);
      await fetchCart();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      setLoading(true);
      await cartAPI.removeItem(cartItemId);
      await fetchCart();
      toast.success('Item removed from cart');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart({ items: [], totalItems: 0, totalPrice: 0, itemCount: 0 });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate cart before checkout
  const validateCart = useCallback(async () => {
    try {
      const response = await cartAPI.validate();
      return response.data.data;
    } catch (err) {
      console.error('Cart validation error:', err);
      return { valid: false, issues: [{ message: 'Failed to validate cart' }] };
    }
  }, []);

  // Check if item is in cart
  const isInCart = useCallback((listingId) => {
    return cart.items.some(item => item.listing_id === listingId);
  }, [cart.items]);

  // Get cart item by listing ID
  const getCartItem = useCallback((listingId) => {
    return cart.items.find(item => item.listing_id === listingId);
  }, [cart.items]);

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    validateCart,
    isInCart,
    getCartItem,
    itemCount: cart.itemCount,
    totalPrice: cart.totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
