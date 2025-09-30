import { useState, useContext } from "react";
import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import './ProductCard.css';
import PropTypes from 'prop-types';
import { ShopContext } from "../../context/ShopContext";
import { Skeleton } from "@mui/material";


const ProductCard = ({ product, loading = false }) => {
  const { CartItem, AddToCart, RemoveFromCart } = useContext(ShopContext);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (loading) {
    return (
      <div className="product-card">
        <div className="product-image" style={{ position: 'relative' }}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="circular" width={30} height={30} style={{ position: 'absolute', top: 10, right: 10 }} />
        </div>
        <div className="product-info">
          <div className="link-area">
            <Skeleton variant="text" width="90%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} variant="circular" width={16} height={16} />
              ))}
            </div>
          </div>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </div>
      </div>
    );
  }

  // Destructuring properties from product prop
  const { _id, image, name, newprice, oldprice, discount, rating } = product;

  // Handle wishlist button toggle
  const handleWishlistClick = () => {
    setIsWishlisted((prevState) => !prevState);
  };

  // Scroll to top when clicking product link
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get quantity from CartItem context
  const quantity = CartItem[_id] || 0;

  // Ensure image is displayed correctly if multiple images are present
  const displayImage = Array.isArray(image) ? image[0] : image;

  return (
    <div className="product-card">
      <div className="product-image" style={{ position: 'relative' }}>
        <img src={displayImage} alt={name} />
        {discount && <span className="discount-badge">{discount}%</span>}
        <button
          className="wishlist-btn"
          onClick={handleWishlistClick}
          style={{ color: isWishlisted ? 'red' : 'gray' }}
        >
          <FaHeart />
        </button>
      </div>

      <div className="product-info">
        <div className="link-area">
          <Link
            to={`/product/${_id}`} // Using _id to ensure correct product link
            style={{ textDecoration: 'none' }}
            onClick={handleLinkClick}
          >
            <h5 className="product-name">{name}</h5>
            <div className="product-pricing">
              <span className="current-price">₹{newprice}</span>
              {oldprice && oldprice !== newprice && (
                <span className="old-price">₹{oldprice}</span>
              )}
            </div>
            <div className="product-rating">
              {Array.from({ length: rating }, (_, i) => (
                <FaStar key={i} className="star" />
              ))}
            </div>
          </Link>
        </div>

        <div className="cart-container">
          {quantity === 0 ? (
            <button
              className="add-to-cart-btn"
              onClick={() => AddToCart(_id)} // Use _id here for consistency
            >
              <FaShoppingCart /> Add to Cart
            </button>
          ) : (
            <div className="cart-item-quantity">
              <button
                className="quantity-btn"
                onClick={() => RemoveFromCart(_id)} // Use _id here for consistency
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => AddToCart(_id)} // Use _id here for consistency
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Define prop types for validation
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Use _id to ensure consistency with backend
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    name: PropTypes.string.isRequired,
    newprice: PropTypes.number.isRequired,
    oldprice: PropTypes.number, // Fixed oldprice to oldPrice for consistency
    discount: PropTypes.number,
    rating: PropTypes.number.isRequired,
  }),
  loading: PropTypes.bool,
};

export default ProductCard;
