import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import { Suspense, lazy, useEffect } from 'react';
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext"; // Add this import
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/AdminLogin";

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminAddProduct = lazy(() => import('./pages/admin/AddProduct'));
const AdminProducts = lazy(() => import('./pages/admin/ManageProducts'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminSubscribers = lazy(() => import('./pages/admin/Subscribers'));
// Removed AdminSettings import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider> {/* Add OrderProvider here */}
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg font-bold text-primary">Loading...</div>}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<><Navigation /><Home /></>} />
                      <Route path="/products" element={<><Navigation /><Products /></>} />
                      <Route path="/products/:id" element={<><Navigation /><ProductDetail /></>} />
                      <Route path="/about" element={<><Navigation /><About /></>} />
                      <Route path="/login" element={<><Navigation /><Login /></>} />
                      <Route path="/register" element={<><Navigation /><Register /></>} />
                      <Route path="/cart" element={<><Navigation /><Cart /></>} />
                      <Route path="/wishlist" element={<><Navigation /><Wishlist /></>} />
                      <Route path="/contact" element={<><Navigation /><Contact /></>} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      
                      {/* Admin Routes - Wrapped with AdminLayout */}
                      <Route path="/admin" element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminLayout />
                        </ProtectedRoute>
                      }>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products/add" element={<AdminAddProduct />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="subscribers" element={<AdminSubscribers />} />
                        {/* Removed settings route */}
                      </Route>
                      
                      {/* Catch-all Route */}
                      <Route path="*" element={<><Navigation /><NotFound /></>} />
                    </Routes>
                  </Suspense>
                </div>
              </BrowserRouter>
            </OrderProvider> {/* Close OrderProvider */}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
