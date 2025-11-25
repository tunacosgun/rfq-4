import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import '@/App.css';

// Customer pages
import HomePage from './pages/customer/HomePage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import QuoteCartPage from './pages/customer/QuoteCartPage';
import QuoteFormPage from './pages/customer/QuoteFormPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminQuoteDetail from './pages/admin/AdminQuoteDetail';
import AdminSettings from './pages/admin/AdminSettings';

// Context
import { QuoteCartProvider } from './context/QuoteCartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

function App() {
  return (
    <AdminAuthProvider>
      <QuoteCartProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/urun/:id" element={<ProductDetailPage />} />
              <Route path="/teklif-sepeti" element={<QuoteCartPage />} />
              <Route path="/teklif-gonder" element={<QuoteFormPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/kategoriler" element={<AdminCategories />} />
              <Route path="/admin/urunler" element={<AdminProducts />} />
              <Route path="/admin/teklifler" element={<AdminQuotes />} />
              <Route path="/admin/teklifler/:id" element={<AdminQuoteDetail />} />
              <Route path="/admin/ayarlar" element={<AdminSettings />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </div>
      </QuoteCartProvider>
    </AdminAuthProvider>
  );
}

export default App;