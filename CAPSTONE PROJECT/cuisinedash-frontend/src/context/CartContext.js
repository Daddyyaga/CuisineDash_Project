import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  const fetchCartData = async () => {
    if (user) {
      try {
        const response = await axios.get(`https://localhost:7228/api/cart/${user.id}`);
        console.log('Fetched cart data:', response.data);

        const items = response.data.cartItems?.$values || response.data.cartItems || [];
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await axios.post(`https://localhost:7228/api/cart/add`, {
        userId: user.id,
        menuItemId: item.id,
        quantity: 1
      });

      const items = response.data.cartItems?.$values || response.data.cartItems || [];
      setCartItems(items);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`https://localhost:7228/api/cart/remove/${id}`);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`https://localhost:7228/api/cart/clear/${user.id}`);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems
      .filter(item => item?.menuItem?.price)  // Ensure the item and price exist
      .reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
  try {
    const response = await axios.put(`https://localhost:7228/api/cart/update-quantity`, {
      cartItemId,
      newQuantity,
    });

    // Update the cartItems with the response data
    setCartItems(response.data.cartItems);
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
};


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getTotalPrice, fetchCartData, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
