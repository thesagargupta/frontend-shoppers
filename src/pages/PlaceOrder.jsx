import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "./PlaceOrder.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@mui/material";
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

      <h2 className="page-title">Place Your Order</h2>

      <div className="content-wrapper">
        {/* Order Summary Section */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {productsInCart.map((product) => (
            <div key={product._id} className="order-item">
              <img
                src={getProductImages(product)} // Use the helper function for image
                alt={product.name}
                className="order-item-image"
              />
              <div className="order-item-details">
                <h4>{product.name}</h4>
                <p>
                  Price: ₹
                  {product.newprice ? product.newprice.toFixed(2) : "0.00"}
                </p>
                <p>Quantity: {cartItems[product._id]}</p>
              </div>
            </div>
          ))}
          <hr />
          <h3 className="total-amount">
            Total Amount: ₹{finalAmount.toFixed(2)}
          </h3>
        </div>

        {/* Order Form Section */}
        <div className="order-form">
          <h3>Shipping Details</h3>
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              required
            />

            <label htmlFor="house-number">PinCode:</label>
            <input
              type="text"
              id="pin-code"
              name="pincode"
              placeholder="Enter your pin code"
              required
              onChange={handlePincodeChange}
              pattern="^\d{6}$" // Ensure the pincode is 6 digits
              title="Pincode should be a 6-digit number"
            />

            <label htmlFor="apartment">Apartment/Flat/Landmark:</label>
            <input
              type="text"
              id="apartment"
              required
              name="apartment"
              placeholder="Enter your apartment/flat/landmark name (if applicable)"
            />

            <label htmlFor="landmark">Locality:</label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={city} // Always bind the city input value to the state
              placeholder={
                manualCity
                  ? "Enter your city"
                  : "City will be auto-filled based on pincode"
              }
              onChange={manualCity ? (e) => setCity(e.target.value) : null} // Allow manual city input if selected
              required
            />

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="manualCity"
                checked={manualCity}
                onChange={handleManualCityToggle}
              />
              <label className="form-check-label" htmlFor="manualCity">
                Enter City Manually
              </label>
            </div>

            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={stateName} // Always bind the state input value to the state
              placeholder={
                manualState
                  ? "Enter your state"
                  : "State will be auto-filled based on pincode"
              }
              onChange={
                manualState ? (e) => setStateName(e.target.value) : null
              } // Allow manual state input if selected
              required
            />

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="manualState"
                checked={manualState}
                onChange={handleManualStateToggle}
              />
              <label className="form-check-label" htmlFor="manualState">
                Enter State Manually
              </label>
            </div>

            <label htmlFor="payment">Prefered Gateway:</label>
            <select id="payment" name="payment" required>
              <option value="cod">Cash On Delivery</option>
              <option value="stripe">Stripe</option>
              <option value="razorpay">Razorpay</option>
            </select>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="saveInfo"
                {...register("saveInfo")}
              />
              <label className="form-check-label" htmlFor="saveInfo">
                Save this information for faster check-out next time
              </label>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
