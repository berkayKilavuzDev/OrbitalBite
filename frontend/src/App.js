import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store"; // Redux store bağlantısı
import Navbar from "./components/Navbar"; // Güncellenmiş navbar eklendi
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart"; // Sepet sayfası
import NotFound from "./pages/NotFound"; // 404 sayfası
import Footer from "./components/Footer";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer /> {/* Navbar değil, sayfanın altına ekledik */}
      </Router>
    </Provider>
  );
}

export default App;
