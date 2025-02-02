import { useEffect, useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import "./Order.css"; // Make sure necessary styles are in this file

const Order = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login"); // Redirect to login after showing the toast
    }
  }, [token, navigate]);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
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
          console.log("failed to fetch order")
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl, token]);

  if (isLoading) {
    return <div>Loading orders...</div>;
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
                  className={`fas fa-check-circle ${order.status.toLowerCase()}`}
                />
                Status:{" "}
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>{" "}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
