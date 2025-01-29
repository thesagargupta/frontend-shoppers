import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import "./PlaceOrder.css";
import { useForm } from "react-hook-form";


const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const { cartItems = {}, finalAmount = 0 } = state || {};
  const { products } = useContext(ShopContext); // Fetch products from the backend
  const { register } = useForm();

  // State to store city based on pincode
  const [city, setCity] = useState("");
  const [manualCity, setManualCity] = useState(false); // State to toggle manual city input
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
    return <div>Loading...</div>; // Optionally show a loading state
  }

  // Filter products in the cart using the backend data
  const productsInCart = products.filter(
    (product) => cartItems[product._id] > 0 // Use _id from backend data
  );

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    navigate("/"); // Navigate to the home page after placing the order
  };

  // Function to handle pincode input and set city
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;

    // Call an API (e.g., Zippopotam) to fetch city based on pincode
    if (pincode.length === 6 && !manualCity) {
      // Only auto-fill when manual is not selected
      try {
        const response = await fetch(`https://api.zippopotam.us/in/${pincode}`);
        if (response.ok) {
          const data = await response.json();
          const cityName = data.places[0]["place name"];
          setCity(cityName);
        } else {
          setCity(""); // Reset if no city found
        }
      } catch (error) {
        console.error("Error fetching city:", error);
        setCity(""); // Reset on error
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

  // Helper function to get the first image or a fallback image
  const getProductImages = (product) => {
    const images = Array.isArray(product.image)
      ? product.image
      : [product.image];
    return images.length > 0 ? images[0] : "/default-image.png"; // Fallback to a default image if not available
  };

  return (
    <div className="place-order-container">
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
          <form onSubmit={handlePlaceOrder}>
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

            <label htmlFor="landmark">City:</label>
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

            <label htmlFor="payment">Prefered Gateway:</label>
            <select id="payment" name="payment" required>
              <option value="stripe">
                Stripe
              </option>
              <option value="razorpay">
                Razorpay
              </option>
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
