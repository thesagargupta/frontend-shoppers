/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import Wishlist from "./pages/Wishlist";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import About from "./pages/About";
import User from "./pages/User";
import Contact from "./pages/Contact";
import Navbar from "./components/NavbarFolder/Navbar";
import Footer from "./components/NavbarFolder/Footer";
import Cart from "./pages/Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import Error from "./pages/Error";
import "font-awesome/css/font-awesome.min.css";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import PlaceOrder from "./pages/PlaceOrder";
import React from 'react';
import ScrollToTop from "./pages/ScrollToTop";
import SearchResults from "./pages/SearchResult";
import ShopContextProvider from "./context/ShopContext"; // Import ShopContextProvider

const App = () => {
  return (
    <ShopContextProvider>  {/* Wrap the entire app with ShopContextProvider */}
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<User />} />
        <Route path="*" element={<Error />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>
      <Footer />
    </ShopContextProvider>
  );
};

export default App;
