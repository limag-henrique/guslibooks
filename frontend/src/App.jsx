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
  const [isAppRevealed, setIsAppRevealed] = useState(false);

  useEffect(() => {
    // Exactly at 3000ms, the loading page closes and the circular reveal triggers
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsAppRevealed(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        {/* The persistent dark green background that the app reveals *from* */}
        <div className="fixed inset-0 bg-[#12271D] z-[-1]" />

        {showSplash && <SplashScreen />}

        {/* The main app container that geometricially expands */}
        <div
          className="flex flex-col min-h-screen bg-gusli-bg relative"
          style={{
            clipPath: isAppRevealed ? 'circle(150vw at 50vw 50vh)' : 'circle(0px at 50vw 50vh)',
            WebkitClipPath: isAppRevealed ? 'circle(150vw at 50vw 50vh)' : 'circle(0px at 50vw 50vh)',
            transition: 'clip-path 1s cubic-bezier(0.64, 0, 0.78, 0), -webkit-clip-path 1s cubic-bezier(0.64, 0, 0.78, 0)'
          }}
        >
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
