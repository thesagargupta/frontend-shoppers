import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import ProductCard from "../components/Navbar/ProductCard";
import "./Categorypage.css";
import Breadcrumbs from "./Breadcrumbs";
import React from 'react';


const CategoryPage = () => {
  const { categoryName } = useParams();
  const { products } = useContext(ShopContext); // Access combined products from context

  // Capitalize the first letter of categoryName
  const formattedCategoryName =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();

  // Filter products by category
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="cat-page">
      <Breadcrumbs category={categoryName} /> {/* Breadcrumb component */}
      <h2 className="Category-product-name">{formattedCategoryName} Products</h2>

      <div className="products-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard
              key={product._id || `product-${index}`} // Ensure unique key from _id
              product={{
                ...product,
                oldPrice: product.oldPrice || product.price, // Ensure oldPrice is handled properly
              }}
            />
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
