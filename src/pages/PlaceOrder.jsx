import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "./PlaceOrder.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@mui/material";
import { FaMoneyBillWave, FaCreditCard, FaShippingFast, FaShieldAlt, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const { cartItems = {}, finalAmount = 0 } = state || {};
  const { products, backendUrl, token, SetCartItem } = useContext(ShopContext); // Fetch products from the backend
  const { register } = useForm();

  // State to store city and state based on pincode
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [manualCity, setManualCity] = useState(false); // State to toggle manual city input
  const [manualState, setManualState] = useState(false); // State to toggle manual state input
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  // Effect to check loading and navigate if data is unavailable
  useEffect(() => {
    if (!Object.keys(cartItems).length || !products?.length) {
      navigate("/cart");
    } else {
      setIsLoading(false); // Set loading to false when data is ready
    }
  }, [cartItems, products, navigate]);

  if (isLoading) {
    return (
      <div className="place-order-container">
        <Toaster position="top-center" reverseOrder={false} />
        <h2 className="page-title">
          <Skeleton variant="text" width="200px" height={40} />
        </h2>
        <div className="content-wrapper">
          {/* Order Summary Skeleton */}
          <div className="order-summary">
            <Skeleton variant="text" width="150px" height={30} style={{ marginBottom: 20 }} />
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="order-item">
                <Skeleton variant="rectangular" width={80} height={80} />
                <div className="order-item-details">
                  <Skeleton variant="text" width="150px" height={24} />
                  <Skeleton variant="text" width="100px" height={18} />
                  <Skeleton variant="text" width="80px" height={18} />
                </div>
              </div>
            ))}
            <hr />
            <Skeleton variant="text" width="180px" height={30} />
          </div>

          {/* Order Form Skeleton */}
          <div className="order-form">
            <Skeleton variant="text" width="160px" height={30} style={{ marginBottom: 20 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <Skeleton variant="text" width="80px" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />

              <Skeleton variant="text" width="120px" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />

              <Skeleton variant="text" width="70px" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />

              <Skeleton variant="text" width="60px" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />

              <Skeleton variant="text" width="50px" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />

              <Skeleton variant="text" width="40px" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />

              <Skeleton variant="text" width="130px" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />

              <Skeleton variant="rectangular" width="200px" height={40} style={{ marginTop: 20 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter products in the cart using the backend data
  const productsInCart = products.filter(
    (product) => cartItems[product._id] > 0 // Use _id from backend data
  );

  // Function to handle pincode input and set city and state
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;

    // Call an API (e.g., Zippopotam) to fetch city and state based on pincode
    if (pincode.length === 6 && !manualCity && !manualState) {
      // Only auto-fill when manual input is not selected
      try {
        const response = await fetch(`https://api.zippopotam.us/in/${pincode}`);
        if (response.ok) {
          const data = await response.json();
          const cityName = data.places[0]["place name"];
          const stateName = data.places[0]["state"];
          setCity(cityName);
          setStateName(stateName);
        } else {
          setCity(""); // Reset if no city found
          setStateName(""); // Reset if no state found
        }
      } catch (error) {
        console.error("Error fetching city and state:", error);
        setCity(""); // Reset on error
        setStateName(""); // Reset on error
      }
    }
  };

  // Handle the manual city input toggle
  const handleManualCityToggle = () => {
    setManualCity(!manualCity);
    if (!manualCity) {
      setCity(""); // Clear city when toggling to manual input
    }
  };

  // Handle the manual state input toggle
  const handleManualStateToggle = () => {
    setManualState(!manualState);
    if (!manualState) {
      setStateName(""); // Clear state when toggling to manual input
    }
  };

  // Helper function to get the first image or a fallback image
  const getProductImages = (product) => {
    const images = Array.isArray(product.image)
      ? product.image
      : [product.image];
    return images.length > 0 ? images[0] : "/default-image.png"; // Fallback to a default image if not available
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Start loading toast
    const loadingToast = toast.loading("Placing your order...");

    // Validate form fields before processing the order
    const name = event.target.name.value.trim();
    const phone = event.target.phone.value.trim();
    const pincode = event.target.pincode.value.trim();
    const apartment = event.target.apartment.value.trim();
    const locality = event.target.landmark.value.trim();

    // Validation checks
    if (!name) {
      toast.error("Full Name is required!");
      toast.dismiss(loadingToast);
      return;
    }
    if (!validatePhone(phone)) {
      toast.error("Please enter a valid phone number!");
      toast.dismiss(loadingToast);
      return;
    }
    if (!validatePincode(pincode)) {
      toast.error("Please enter a valid 6-digit pincode!");
      toast.dismiss(loadingToast);
      return;
    }
    if (!apartment) {
      toast.error("Apartment/Flat/Landmark is required!");
      toast.dismiss(loadingToast);
      return;
    }
    if (!locality) {
      toast.error("Locality is required!");
      toast.dismiss(loadingToast);
      return;
    }

    if (!validateName(name)) {
      toast.error("Full Name must be at least 5 characters!");
      toast.dismiss(loadingToast);
      return;
    }

    if (!validateAddress(apartment)) {
      toast.error("Address must be at least 15 characters long!");
      toast.dismiss(loadingToast);
      return;
    }

    const orderItems = [];
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = structuredClone(
          products.find((product) => product._id === item)
        );
        if (itemInfo) {
          itemInfo.quantity = cartItems[item];
          orderItems.push(itemInfo);
        }
      }
    }

    const paymentMethod = event.target.payment.value;

    // Determine the API endpoint based on the selected payment method
    let orderUrl = `${backendUrl}/api/order/place`; // Default endpoint for COD
    if (paymentMethod === "stripe") {
      orderUrl = `${backendUrl}/api/order/stripe`;
    } else if (paymentMethod === "razorpay") {
      orderUrl = `${backendUrl}/api/order/razorpay`;
    }

    const orderData = {
      items: orderItems,
      amount: finalAmount,
      address: {
        fullName: name,
        phoneNumber: phone,
        pincode: pincode,
        city: manualCity ? city : stateName,
        state: manualState ? stateName : city,
        apartment,
        locality,
      },
      paymentMethod,
    };

    try {
      const response = await fetch(orderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Handle Razorpay payment
        if (paymentMethod === "razorpay") {
          toast.dismiss(loadingToast);
          handleRazorpayPayment(responseData, name, phone);
          return;
        }

        toast.success("Order placed successfully!");

        // Clear the cart from both state and local storage
        SetCartItem({});
        localStorage.removeItem("cartItems");

        // Call the backend API to clear the cart in the database
        await fetch(`${backendUrl}/api/cart/clear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Navigate to the order confirmation page after clearing the cart
        setTimeout(() => {
          navigate("/orders");
        }, 2000); // Navigate after 2 seconds
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to place order. Please try again."
        );
      }
    } catch (error) {
      toast.error("Error placing order. Please try again.");
      console.error("Error placing order:", error);
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast when request completes
    }
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = (orderData, name, phone) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Shoopers",
      description: "Order Payment",
      order_id: orderData.orderId,
      handler: async function (response) {
        // Verify payment
        const loadingToast = toast.loading("Verifying payment...");
        try {
          const verifyResponse = await fetch(
            `${backendUrl}/api/order/verifyRazorpay`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId,
              }),
            }
          );

          if (verifyResponse.ok) {
            toast.success("Payment verified successfully!");

            // Clear the cart from both state and local storage
            SetCartItem({});
            localStorage.removeItem("cartItems");

            // Call the backend API to clear the cart in the database
            await fetch(`${backendUrl}/api/cart/clear`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            // Navigate to the order confirmation page
            setTimeout(() => {
              navigate("/orders");
            }, 2000);
          } else {
            toast.error("Payment verification failed!");
          }
        } catch (error) {
          toast.error("Error verifying payment!");
          console.error("Payment verification error:", error);
        } finally {
          toast.dismiss(loadingToast);
        }
      },
      prefill: {
        name: name,
        contact: phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", function (response) {
      toast.error("Payment failed! Please try again.");
      console.error("Payment failed:", response.error);
    });
    razorpay.open();
  };
  // Utility functions for validation
  const validatePhone = (phone) => {
    const phonePattern = /^[6-9]\d{9}$/;
    return phonePattern.test(phone);
  };

  const validatePincode = (pincode) => {
    const pincodePattern = /^\d{6}$/;
    return pincodePattern.test(pincode);
  };

  // Name validation: Ensures minimum 5 characters
  const validateName = (name) => {
    return name.trim().length >= 5;
  };

  const validateAddress = (apartment) => {
    return apartment.trim().length >= 15;
  };

  return (
    <div className="place-order-container">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="page-header">
        <FaShippingFast className="header-icon" />
        <h2 className="page-title">Complete Your Order</h2>
        <p className="page-subtitle">Review your cart and enter delivery details</p>
      </div>

      <div className="trust-badges">
        <div className="badge">
          <FaShieldAlt className="badge-icon" />
          <span>Secure Payment</span>
        </div>
        <div className="badge">
          <FaShippingFast className="badge-icon" />
          <span>Fast Delivery</span>
        </div>
        <div className="badge">
          <FaMoneyBillWave className="badge-icon" />
          <span>Easy Returns</span>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Order Form Section */}
        <div className="order-form">
          <div className="section-header">
            <FaMapMarkerAlt className="section-icon" />
            <h3>Shipping Information</h3>
          </div>
          
          <form onSubmit={onSubmitHandler}>
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="name">
                  <FaUser className="label-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">
                  <FaPhone className="label-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="pin-code">
                  <FaMapMarkerAlt className="label-icon" />
                  Pincode
                </label>
                <input
                  type="text"
                  id="pin-code"
                  name="pincode"
                  placeholder="Enter 6-digit pincode"
                  required
                  onChange={handlePincodeChange}
                  pattern="^\d{6}$"
                  title="Pincode should be a 6-digit number"
                />
              </div>

              <div className="input-group">
                <label htmlFor="apartment">Apartment/Flat No.</label>
                <input
                  type="text"
                  id="apartment"
                  required
                  name="apartment"
                  placeholder="House/Flat/Building name"
                />
              </div>
            </div>

            <div className="input-group full-width">
              <label htmlFor="landmark">Locality/Street</label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={city}
                placeholder={
                  manualCity
                    ? "Enter your locality"
                    : "Auto-filled based on pincode"
                }
                onChange={(e) => setCity(e.target.value)}
                readOnly={!manualCity}
                required
              />
              <div className="checkbox-inline">
                <input
                  type="checkbox"
                  id="manualCity"
                  checked={manualCity}
                  onChange={handleManualCityToggle}
                />
                <label htmlFor="manualCity">Enter manually</label>
              </div>
            </div>

            <div className="input-group full-width">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={stateName}
                placeholder={
                  manualState
                    ? "Enter your state"
                    : "Auto-filled based on pincode"
                }
                onChange={(e) => setStateName(e.target.value)}
                readOnly={!manualState}
                required
              />
              <div className="checkbox-inline">
                <input
                  type="checkbox"
                  id="manualState"
                  checked={manualState}
                  onChange={handleManualStateToggle}
                />
                <label htmlFor="manualState">Enter manually</label>
              </div>
            </div>

            <div className="section-header payment-header">
              <FaCreditCard className="section-icon" />
              <h3>Payment Method</h3>
            </div>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  defaultChecked
                  required
                />
                <div className="payment-card">
                  <FaMoneyBillWave className="payment-icon cod-icon" />
                  <div className="payment-info">
                    <span className="payment-name">Cash on Delivery</span>
                    <span className="payment-desc">Pay when you receive</span>
                  </div>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  required
                />
                <div className="payment-card">
                  <SiRazorpay className="payment-icon razorpay-icon" />
                  <div className="payment-info">
                    <span className="payment-name">Razorpay</span>
                    <span className="payment-desc">UPI, Cards, NetBanking</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="form-check-box">
              <input
                type="checkbox"
                id="saveInfo"
                {...register("saveInfo")}
              />
              <label htmlFor="saveInfo">
                Save this information for faster checkout next time
              </label>
            </div>

            <button type="submit" className="place-order-btn">
              <FaShieldAlt className="btn-icon" />
              Complete Order
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary">
          <div className="summary-header">
            <h3>Order Summary</h3>
            <span className="item-count">{productsInCart.length} items</span>
          </div>
          
          <div className="summary-items">
            {productsInCart.map((product) => (
              <div key={product._id} className="order-item">
                <img
                  src={getProductImages(product)}
                  alt={product.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <h4>{product.name}</h4>
                  <p className="item-price">
                    ₹{product.newprice ? product.newprice.toFixed(2) : "0.00"}
                  </p>
                  <p className="item-quantity">Qty: {cartItems[product._id]}</p>
                </div>
                <div className="item-total">
                  ₹{(product.newprice * cartItems[product._id]).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{finalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-tag">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span className="total-amount">₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
