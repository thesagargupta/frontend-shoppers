import { useState, useEffect, useContext } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { FaHeart, FaShoppingCart, FaShoppingBag, FaStar } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";
import "./ProductPage.css";
import Suggestion from "./Suggestion";
import toast, { Toaster } from "react-hot-toast";
import { ShopContext } from "../context/ShopContext";
import { Skeleton } from "@mui/material";

const ProductPage = () => {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null); // Product data
  const [loading, setLoading] = useState(true); // Loading state
  const [isWishlisted, setIsWishlisted] = useState(false); // Wishlist state
  const { CartItem, AddToCart, RemoveFromCart, token } =
    useContext(ShopContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend URL from .env file
  const navigate = useNavigate(); // Use navigate hook to redirect to another route

  const quantity = CartItem[id] || 0; // Quantity in the cart for this product

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(backendUrl + "/api/product/single", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        if (data.success) {
          const images = Array.isArray(data.product.image)
            ? data.product.image
            : [data.product.image]; // Ensure product images are in an array
          setProduct({ ...data.product, images });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, backendUrl]);

  const handleImageChange = (image) => {
    document.getElementById("main-product-image").src = image;
  };

  const handleWishlistClick = () => {
    setIsWishlisted((prevState) => !prevState);
  };

  const handleBuyNow = () => {
    if (!token) {
      toast.error("Please log in to continue!");
      setTimeout(() => navigate("/signup"), 1000); // Redirect after 1 second
    } else {
      AddToCart(id);
      navigate("/place-order");
    }
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="product-details">
          {/* Product Gallery Skeleton */}
          <div className="product-gallery">
            <div className="main-image">
              <Skeleton variant="rectangular" width="100%" height={400} />
            </div>
            <div className="thumbnails">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={80} style={{ marginRight: 10 }} />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="product-info">
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Skeleton variant="rectangular" width={150} height={40} />
              <Skeleton variant="rectangular" width={150} height={40} />
            </div>
          </div>
        </div>

        {/* Delivery Info Skeleton */}
        <div className="delivery-info">
          <div className="info-item">
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="80%" height={15} />
          </div>
          <div className="info-item">
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="80%" height={15} />
          </div>
        </div>

        {/* Suggested Items Skeleton */}
        <div className="suggested-item">
          <Skeleton variant="text" width="30%" height={30} style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 20 }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ flex: 1 }}>
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Skeleton variant="text" width="80%" height={20} style={{ marginTop: 10 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="no-product">
        <p>
          Product not found. Please check the URL or return to the homepage.
        </p>
        <NavLink to="/" className="back-home-link">
          Back to Home
        </NavLink>
      </div>
    );
  }

  return (
    <div className="product-page">
      <Toaster position="top-center" reverseOrder={false} />
      <Breadcrumbs category={product.category} productName={product.name} />
      <div className="product-details">
        {/* Product Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              id="main-product-image"
              src={product.images?.[0] || "/fallback-image.png"} // Use Cloudinary URL or fallback image
              alt={product.name}
              onError={(e) => (e.target.src = "/fallback-image.png")}
            />
            <button
              className="wishlist-btn"
              onClick={handleWishlistClick}
              style={{ color: isWishlisted ? "red" : "gray" }}
            >
              <FaHeart />
            </button>
          </div>
          <div className="thumbnails">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail"
                onClick={() => handleImageChange(image)}
                onError={(e) => (e.target.src = "/fallback-thumbnail.png")}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                color={i < product.rating ? "gold" : "#ddd"}
                size={20}
              />
            ))}
            <span>({product.rating} Reviews)</span>
            <span className="stock"> | In Stock</span>
          </div>

          <div className="product-pricing">
            <span className="current-price">₹{product.newprice}</span>
            {product.oldprice && (
              <span className="old-price">₹{product.oldprice}</span>
            )}
            {product.discount && (
              <span className="discount">Save {product.discount}%</span>
            )}
          </div>

          <p className="description">{product.description}</p>

          <div className="product-actions">
            {quantity === 0 ? (
              <button className="add-to-cart-btn" onClick={() => AddToCart(id)}>
                <FaShoppingCart /> Add to Cart
              </button>
            ) : (
              <div className="cart-item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => RemoveFromCart(id)}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button className="quantity-btn" onClick={() => AddToCart(id)}>
                  +
                </button>
              </div>
            )}
            <button className="buy-now-btn" onClick={handleBuyNow}>
              <FaShoppingBag className="buy" /> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Info Section */}
      <div className="delivery-info">
        <div className="info-item">
          <p>
            <TbTruckDelivery /> Free Delivery
          </p>
          <small>Enter your postal code for delivery availability.</small>
        </div>
        <div className="info-item">
          <p>
            <GiReturnArrow /> Easy Return
          </p>
          <small>Free 30 Days Delivery Returns.</small>
        </div>
      </div>

      {/* Suggested Items */}
      <div className="suggested-item">
        <Suggestion />
      </div>
    </div>
  );
};

export default ProductPage;
