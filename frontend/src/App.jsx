import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CartModal from './components/CartModal';
import SplashScreen from './components/SplashScreen';
import MyAccount from './pages/MyAccount';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import DeleteCart from './pages/DeleteCart';
import Author from './pages/Author';
import Success from './pages/Success';

import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        {showSplash && <SplashScreen />}
        <div className="flex flex-col min-h-screen bg-gusli-bg relative">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/account" element={<MyAccount />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/delete-cart" element={<DeleteCart />} />
              <Route path="/author/:name" element={<Author />} />
              <Route path="/success" element={<Success />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <CartModal />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
