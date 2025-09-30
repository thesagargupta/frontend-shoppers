import { useEffect, useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import "./Order.css"; // Ensure necessary styles are included
import { Skeleton } from "@mui/material";

const Order = () => {
  const { backendUrl, token, setToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && storedToken) {
      setToken(storedToken); // Update context with stored token
    } else if (!token) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [token, navigate, setToken]);

  // Fetch orders when the component mounts and token is available
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return; // Ensure token is available

      try {
        const response = await fetch(`${backendUrl}/api/order/userorders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("An error occurred while fetching orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl, token]);

  if (isLoading) {
    return (
      <div className="order-container">
        <Skeleton variant="text" width="200px" height={40} style={{ marginBottom: 20, marginLeft: 'auto', marginRight: 'auto' }} />
        <div className="orders-list">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="order-item">
              <div className="order-header">
                <Skeleton variant="text" width="150px" height={30} />
                <Skeleton variant="text" width="120px" height={20} />
                <Skeleton variant="text" width="180px" height={20} />
              </div>

              <div className="order-items">
                <Skeleton variant="text" width="80px" height={24} style={{ marginBottom: 10 }} />
                {Array.from({ length: 2 }, (_, j) => (
                  <div key={j} className="order-item-detail">
                    <Skeleton variant="rectangular" width={80} height={80} />
                    <div className="order-item-info">
                      <Skeleton variant="text" width="150px" height={20} />
                      <Skeleton variant="text" width="100px" height={18} />
                      <Skeleton variant="text" width="80px" height={18} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <Skeleton variant="text" width="120px" height={24} />
                <Skeleton variant="text" width="100px" height={20} />
              </div>

              <div className="order-shipping-details">
                <Skeleton variant="text" width="140px" height={24} />
                <Skeleton variant="text" width="120px" height={18} />
                <Skeleton variant="text" width="200px" height={18} />
                <Skeleton variant="text" width="150px" height={18} />
                <Skeleton variant="text" width="120px" height={18} />
                <Skeleton variant="text" width="140px" height={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-container">
        <h2>No orders found</h2>
        <p>It seems like you don’t have any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="order-container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="page-title">Your Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <div className="order-header">
              <h3>Order #{order._id}</h3>
              <p>
                <i
                  className={`fas ${
                    order.status === "Cancelled"
                      ? "fa-times-circle canceled"
                      : "fa-check-circle"
                  } ${order.status.toLowerCase()}`}
                />
                Status:{" "}
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
            </div>

            <div className="order-items">
              <h4>Items</h4>
              {order.items.map((item) => (
                <div key={item._id} className="order-item-detail">
                  <img
                    src={item.image[0] || "/default-image.png"}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-info">
                    <h5>{item.name}</h5>
                    <p>Price: ₹{item.newprice?.toFixed(2) || "0.00"}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h4>Order Summary</h4>
              <p>Total: ₹{order.amount.toFixed(2)}</p>
            </div>

            <div className="order-shipping-details">
              <h4>Shipping Address</h4>
              <p>{order.address.fullName}</p>
              <p>
                {order.address.apartment}, {order.address.locality}
              </p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.pincode}
              </p>
              <p>Phone: {order.address.phoneNumber}</p>
              <p>Payment Method: {order.paymentMethod}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
