import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import AdminRestaurant from './pages/AdminRestaurant';
import AdminMenuItem from './pages/AdminMenuItem';
import AdminOrders from './pages/AdminOrders';
import Cart from './pages/Cart';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Checkout from './pages/Checkout'; // Import the Checkout page
import AdminRoute from './components/AdminRoute'; // AdminRoute for protecting admin pages
import { ToastContainer } from 'react-toastify'; // Import ToastContainer for toast notifications
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router> {/* Router should wrap everything */}
      <AuthProvider>  {/* AuthProvider should be inside Router */}
        <CartProvider> {/* CartProvider */}
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurants" element={<RestaurantList />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/restaurants" element={
                <AdminRoute>
                  <AdminRestaurant />
                </AdminRoute>
              } />
              <Route path="/admin/menu-items" element={
                <AdminRoute>
                  <AdminMenuItem />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } />
            </Routes>
            <Footer />

            {/* ToastContainer for showing toast notifications */}
            <ToastContainer /> 
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
