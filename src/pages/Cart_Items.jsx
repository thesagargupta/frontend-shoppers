import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart_Items.css";
import { FaTrashAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

const Cart_Items = () => {
  const {
    CartItem,
    products,
    RemoveFromCart,
    AddToCart,
    clearCart,
  } = useContext(ShopContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [isLoading, setIsLoading] = useState(true); // Loading state to prevent rendering too early

  // Ensure that the products and cart are fully loaded before setting isLoading to false
  useEffect(() => {
    if (products.length > 0 && Object.keys(CartItem).length > 0) {
      setIsLoading(false); // Set loading to false once products and cart are ready
    }
  }, [products, CartItem]);

  // Handle removing an item from the cart
  const handleDeleteItem = (itemId) => {
    RemoveFromCart(itemId);
  };

  // Handle clearing the cart
  const handleClearCart = () => {
    clearCart();
  };

  // Handle smooth scroll to top
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle coupon application with toast notifications
  const handleCouponApply = () => {
    if (couponCode === "DISCOUNT10") {
      setCouponApplied(true);
      setDiscountPercentage(10);
      toast.success("Coupon successfully applied! 🎉");
    } else if (couponCode === "SUNNYLEONE90") {
      setCouponApplied(true);
      setDiscountPercentage(90);
      toast.success("Coupon successfully applied! 🎉");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  // Calculate total amount
  const totalAmount = Object.keys(CartItem).reduce((total, itemId) => {
    const quantity = CartItem[itemId];
    if (quantity > 0) {
      const product = products.find(
        (item) => String(item._id) === String(itemId)
      ); // Use _id instead of id
      if (product) {
        total += product.newprice * quantity;
      }
    }
    return total;
  }, 0);

  // Calculate final amount after discount
  const finalAmount = couponApplied
    ? totalAmount * ((100 - discountPercentage) / 100)
    : totalAmount;

  // Function to handle images, ensuring we always get an array
  const getProductImages = (product) => {
    const images = Array.isArray(product.image) ? product.image : [product.image];
    return images.length > 0 ? images[0] : "/default-image.png"; // Fallback to a default image if not available
  };

  const handleCheckout = () => {
    // Check if the cart is empty before navigating
    if (Object.keys(CartItem).length === 0) {
      toast.error("Your cart is empty. Please add items before proceeding.");
      return;
    }

    // Proceed to checkout only if cart is not empty
    navigate("/place-order", {
      state: { cartItems: CartItem, finalAmount },
    });
  };

  // Return loading state if products are not yet loaded
  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  // Once products and cart are loaded, render the content
  return (
    <div className="cart-items-container">
      {/* Add Toaster for toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {Object.keys(CartItem).filter((itemId) => CartItem[itemId] > 0).length === 0 ? (
        <div className="empty-cart-message">
          <p>
            Your cart is empty <FontAwesomeIcon icon={faFaceSadCry} />
          </p>
        </div>
      ) : (
        <div className="cart-items">
          {Object.keys(CartItem).map((itemId) => {
            const quantity = CartItem[itemId];
            if (quantity === 0) return null;

            const product = products.find(
              (item) => String(item._id) === String(itemId) // Ensure consistent comparison with _id
            );
            if (!product) return null;

            const imageUrl = getProductImages(product); // Get product image

            return (
              <div key={itemId} className="cart-item">
                <Link
                  to={`/product/${product._id}`} // Use _id for the product link
                  style={{ textDecoration: "none" }}
                  onClick={handleLinkClick}
                >
                  <div className="cart-item-image">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                </Link>
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => RemoveFromCart(itemId)}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => AddToCart(itemId)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-total">
                    Total: ₹{(product.newprice * quantity).toFixed(2)}
                  </p>
                  <button
                    className="delete-item-btn"
                    onClick={() => handleDeleteItem(itemId)}
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="cart-summary">
        {Object.keys(CartItem).filter((itemId) => CartItem[itemId] > 0).length > 0 && (
          <>
            <div className="coupon-section">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
                placeholder="Enter coupon code"
              />
              <button className="apply-coupon-btn" onClick={handleCouponApply}>
                Apply Coupon
              </button>
              {couponApplied && (
                <p className="coupon-applied">
                  Coupon Applied: {discountPercentage}% Off
                </p>
              )}
            </div>
            <div className="total-amount">
              <p>Total: ₹{totalAmount.toFixed(2)}</p>
              {couponApplied && (
                <p>Discounted Total: ₹{finalAmount.toFixed(2)}</p>
              )}
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout} // Handle checkout logic
            >
              Proceed to Checkout
            </button>
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart_Items;
