import { useState, useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import { ShopContext } from "../../context/ShopContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Context values
  const { SetSearch: setSearchQuery, performSearch, CartItem } = useContext(ShopContext);

  // Calculate cart count only when CartItem changes
  useEffect(() => {
    const count = Object.values(CartItem || {}).reduce((total, quantity) => {
      return total + (Number(quantity) || 0);
    }, 0);
    setCartCount(count);
  }, [CartItem]); // Runs when CartItem changes

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
    setSearchActive(!searchActive);
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
        <NavLink to="/"><span>Shop Now</span></NavLink>
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
              <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={handleLinkClick}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={handleLinkClick}>
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={handleLinkClick}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={handleLinkClick}>
                Orders
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          {/* Search Bar */}
          <div className={`search-bar ${searchActive ? "active" : ""}`}>
            <button className="search-toggle-button" onClick={handleToggleSearch}>
              {searchActive ? <FaTimes /> : <FaSearch />}
            </button>
            {searchActive && (
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  onChange={handleSearchInput}
                />
                <button type="submit">Search</button>
              </form>
            )}
          </div>

          {/* Wishlist */}
          <div className="wishlist">
            <NavLink to="/wishlist"><FaHeart /></NavLink>
          </div>

          {/* Cart */}
          <div className="cart">
            <NavLink to="/cart">
              <FaShoppingCart />
              <div className="cart-count">{cartCount}</div> {/* Always shows a number */}
            </NavLink>
          </div>

          {/* Profile */}
          <div className="profile">
            <NavLink to="/profile"><FaUser /></NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
