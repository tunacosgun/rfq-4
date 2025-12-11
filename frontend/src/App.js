import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import '@/App.css';

// Customer pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import FeaturesPage from './pages/customer/FeaturesPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import QuoteCartPage from './pages/customer/QuoteCartPage';
import QuoteFormPage from './pages/customer/QuoteFormPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProductsEnhanced';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminQuoteDetail from './pages/admin/AdminQuoteDetail';
import AdminSettings from './pages/admin/AdminSettings';
import ColorManagement from './pages/admin/ColorManagement';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminContactMessages from './pages/admin/AdminContactMessages';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminVisitors from './pages/admin/AdminVisitors';
import AdminBalanceEdit from './pages/admin/AdminBalanceEdit';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminUsers from './pages/admin/AdminUsers';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerPanel from './pages/customer/CustomerPanel';
import BrandsPage from './pages/customer/BrandsPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';

// Context
import { QuoteCartProvider } from './context/QuoteCartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';

function App() {
  return (
    <AdminAuthProvider>
      <CustomerAuthProvider>
        <QuoteCartProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/urunler" element={<ProductsPage />} />
              <Route path="/markalar" element={<BrandsPage />} />
              <Route path="/ozellikler" element={<FeaturesPage />} />
              <Route path="/hakkimizda" element={<AboutPage />} />
              <Route path="/iletisim" element={<ContactPage />} />
              <Route path="/urun/:id" element={<ProductDetailPage />} />
              <Route path="/teklif-sepeti" element={<QuoteCartPage />} />
              <Route path="/sepet" element={<QuoteCartPage />} />
              <Route path="/teklif-gonder" element={<QuoteFormPage />} />

              {/* Password Reset Routes */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/kategoriler" element={<AdminCategories />} />
              <Route path="/admin/urunler" element={<AdminProducts />} />
              <Route path="/admin/teklifler" element={<AdminQuotes />} />
              <Route path="/admin/teklifler/:id" element={<AdminQuoteDetail />} />
              <Route path="/admin/kampanyalar" element={<AdminCampaigns />} />
              <Route path="/admin/araclar" element={<AdminVehicles />} />
              <Route path="/admin/mesajlar" element={<AdminContactMessages />} />
              <Route path="/admin/guvenlik" element={<AdminSecurity />} />
              <Route path="/admin/markalar" element={<AdminBrands />} />
              <Route path="/admin/ziyaretciler" element={<AdminVisitors />} />
              <Route path="/admin/musteriler/bakiye/:customerId" element={<AdminBalanceEdit />} />
              <Route path="/admin/musteriler" element={<AdminCustomers />} />
              <Route path="/admin/faq" element={<AdminFAQ />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/ayarlar" element={<AdminSettings />} />
              <Route path="/admin/renkler" element={<ColorManagement />} />
              
              {/* Customer Routes */}
              <Route path="/musteri-giris" element={<CustomerLogin />} />
              <Route path="/musteri-kayit" element={<CustomerRegister />} />
              <Route path="/musteri-panel" element={<CustomerPanel />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </div>
      </QuoteCartProvider>
      </CustomerAuthProvider>
    </AdminAuthProvider>
  );
}

export default App;