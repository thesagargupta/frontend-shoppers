import ProductCard from "../components/Navbar/Productcard";
import "./SearchResult.css";
import React from 'react';
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext"; // Import context to access filtered products

const SearchResults = () => {
  const { filteredProducts } = useContext(ShopContext); // Access filtered products from context

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="search-page">
      {/* Breadcrumb Navigation */}
      <p className="Home">
        <NavLink to="/" onClick={handleLinkClick}>
          Home
        </NavLink>{" "}
        &gt; Search Results
      </p>

      {/* Search Results Heading */}
      <h2 className="search-result-heading">Search Results</h2>

      {/* Display products or a message if no results */}
      <div className="products-list">
        {filteredProducts.length === 0 ? (
          <p>No products found. Try a different search.</p>
        ) : (
          filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id || `product-${index}`} // Ensure unique keys
              product={{
                ...product,
                id: product.id ? product.id.toString() : index.toString(), // Ensure id is a string and unique
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
