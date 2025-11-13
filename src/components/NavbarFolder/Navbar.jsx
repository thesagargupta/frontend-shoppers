import { useState, useContext, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaUser,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import "./Navbar.css";
import { ShopContext } from "../../context/ShopContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const { SetSearch: setSearchQuery, performSearch, CartItem, Search } =
    useContext(ShopContext);

  useEffect(() => {
    const count = Object.values(CartItem || {}).reduce((total, quantity) => {
      return total + (Number(quantity) || 0);
    }, 0);
    setCartCount(count);
  }, [CartItem]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setSearchActive(false);
  }, [location]);

  const handleToggleMenu = () => {
    setMenuActive((prev) => !prev);
    document.body.classList.toggle("menu-open", !menuActive);
  };

  const handleLinkClick = () => {
    setMenuActive(false);
    document.body.classList.remove("menu-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleSearch = () => {
    setSearchActive((prev) => !prev);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div>
      {/* Sale Banner */}
      <div className="sale">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        <NavLink to="/">
          <span>Shop Now</span>
        </NavLink>
      </div>

      {/* Navbar */}
      <div className={`custom-navbar ${menuActive ? "menu-open" : ""}`}>
        <div className="navbar-logo">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="logo" />
          </NavLink>
        </div>

        {/* Hamburger Icon */}
        <div className="burger">
          <button className="navbar-toggle" onClick={handleToggleMenu}>
            {menuActive ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`navbar-links ${menuActive ? "active" : ""}`}>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={handleLinkClick}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={handleLinkClick}
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={handleLinkClick}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={handleLinkClick}
              >
                Orders
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-only">
          <div className={`search-bar ${searchActive ? "active" : ""}`}>
            <button className="search-toggle-button" onClick={handleToggleSearch}>
              {searchActive ? <FaTimes /> : <FaSearch />}
            </button>
          </div>

          <div className="wishlist">
            <NavLink to="/wishlist">
              <FaHeart />
            </NavLink>
          </div>

          <div className="cart">
            <NavLink to="/cart">
              <FaShoppingCart />
              <div className="cart-count">{cartCount}</div>
            </NavLink>
          </div>

          <div className="profile">
            <NavLink to="/profile">
              <FaUser />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Search Bar (Mobile & Desktop) */}
      {searchActive && (
        <div className="search-wrapper">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={Search}
              onChange={handleSearchInput}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `mobile-nav-icon ${isActive ? "active-link" : ""}`}
          onClick={handleLinkClick}
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        <div
          className={`mobile-nav-icon ${searchActive ? "active-link" : ""}`}
          onClick={handleToggleSearch}
        >
          <FaSearch />
          <span>Search</span>
        </div>

        <NavLink
          to="/cart"
          className={({ isActive }) => `mobile-nav-icon ${isActive ? "active-link" : ""}`}
        >
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="bottom-cart-count">{cartCount}</span>
          )}
          <span>Cart</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `mobile-nav-icon ${isActive ? "active-link" : ""}`}
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
