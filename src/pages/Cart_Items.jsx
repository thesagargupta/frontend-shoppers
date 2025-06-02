import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart_Items.css";
import { FaTrashAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

const Cart_Items = () => {
  const {
    CartItem,
    products,
    RemoveFromCart,
    AddToCart,
    clearCart,
    DeleteItemFromCart, // ✅ New delete function from context
  } = useContext(ShopContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0 && Object.keys(CartItem).length >= 0) {
      setIsLoading(false);
    }
  }, [products, CartItem]);

  const handleDeleteItem = (itemId) => {
    DeleteItemFromCart(itemId); // ✅ Fully remove item from cart
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const totalAmount = Object.keys(CartItem).reduce((total, itemId) => {
    const quantity = CartItem[itemId];
    if (quantity > 0) {
      const product = products.find(
        (item) => String(item._id) === String(itemId)
      );
      if (product) {
        total += product.newprice * quantity;
      }
    }
    return total;
  }, 0);

  const finalAmount = couponApplied
    ? totalAmount * ((100 - discountPercentage) / 100)
    : totalAmount;

  const getProductImages = (product) => {
    const images = Array.isArray(product.image) ? product.image : [product.image];
    return images.length > 0 ? images[0] : "/default-image.png";
  };

  const handleCheckout = () => {
    if (Object.keys(CartItem).length === 0) {
      toast.error("Your cart is empty. Please add items before proceeding.");
      return;
    }
    navigate("/place-order", {
      state: { cartItems: CartItem, finalAmount },
    });
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="cart-items-container">
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
              (item) => String(item._id) === String(itemId)
            );
            if (!product) return null;

            const imageUrl = getProductImages(product);

            return (
              <div key={itemId} className="cart-item">
                <Link
                  to={`/product/${product._id}`}
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
                    onClick={() => handleDeleteItem(itemId)} // ✅ Calls DeleteItemFromCart
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
              onClick={handleCheckout}
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
