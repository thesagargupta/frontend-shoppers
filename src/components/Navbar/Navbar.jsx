import { useState, useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import { ShopContext } from "../../context/ShopContext";


const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  
  // Correctly destructure SetSearch as setSearchQuery
  const { SetSearch: setSearchQuery, performSearch, CartItem } = useContext(ShopContext);

  // Calculate the total cart count
  const cartCount = Object.values(CartItem).reduce((total, quantity) => total + quantity, 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleToggleMenu = () => {
    setMenuActive((prev) => !prev);
    if (!menuActive) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
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
    setSearchQuery(e.target.value); // Correctly update search query in context
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(); // Ensure performSearch is called safely
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
              <div className="cart-count">{cartCount}</div>
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
