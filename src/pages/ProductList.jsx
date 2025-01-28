import { Link } from "react-router-dom"; // Import Link for navigation
import "./ProductList.css"
import image1 from "../assets/gaming-pad.jpeg";
import image2 from "../assets/keyboard.jpeg";
import image3 from "../assets/monitor.jpeg";
import image4 from "../assets/chair.jpeg";
import image5 from "../assets/headphone.jpeg";
import image6 from "../assets/watch.jpeg";
import image7 from "../assets/mi-band.jpeg";
import image8 from "../assets/earpods.jpeg";
import React from 'react';


const products = [
  {
    id: 1,
    image: image1,
    name: "HAVIT HV-G92 Gamepad",
    price: 220,
    oldPrice: 250,
    discount: 40,
    rating: 4,
  },
  {
    id: 2,
    image: image2,
    name: "AK-900 Wired Keyboard",
    price: 950,
    oldPrice: 1000,
    discount: 25,
    rating: 5,
  },
  {
    id: 3,
    image: image3,
    name: "IPS LCD Gaming Monitor",
    price: 370,
    oldPrice: 400,
    discount: 30,
    rating: 4,
  },
  {
    id: 4,
    image: image4,
    name: "S-Series Comfort Chair",
    price: 375,
    oldPrice: 400,
    discount: 25,
    rating: 4,
  },
  {
    id: 5,
    image: image5,
    name: "Boult Headphone",
    price: 300,
    oldPrice: 350,
    discount: 15,
    rating: 4,
  },
  {
    id: 6,
    image: image6,
    name: "Boat Watch 6",
    price: 5000,
    oldPrice: 5500,
    discount: 10,
    rating: 5,
  },
  {
    id: 7,
    image: image7,
    name: "MI Band 7",
    price: 900,
    oldPrice: 1000,
    discount: 10,
    rating: 5,
  },
  {
    id: 8,
    image: image8,
    name: "Beat Earpods",
    price: 1000,
    oldPrice: 1500,
    discount: 10,
    rating: 5,
  },
];

const ProductList = () => {
  return (
    <div className="product-list">
      <h2>Our Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <p>Rating: {product.rating} stars</p>
            <Link to={`/product/${product.id}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
