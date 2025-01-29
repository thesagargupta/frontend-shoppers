import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./User.css";
import { MdAccountCircle } from "react-icons/md";

const User = () => {
  const { token, backendUrl, setToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserDetails();
      fetchUserOrders();
    }
  }, [token, navigate]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.user);
      } else {
        throw new Error("Failed to fetch user details.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserOrders = async () => {
    const toastId = toast.loading("Loading orders...");
    try {
      const response = await fetch(`${backendUrl}/api/user/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        toast.success("Orders loaded successfully.", { id: toastId });
      } else {
        throw new Error("Failed to fetch orders.");
      }
    } catch (error) {
      toast.error("Unable to fetch orders. Please try again.", { id: toastId });
      console.log(error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    setTimeout(() => window.location.reload(), 0);
  };

  const handleSaveChanges = async () => {
    if (newPassword !== newPasswordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    const toastId = toast.loading("Saving changes...");
    try {
      const response = await fetch(`${backendUrl}/api/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          password: newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Profile updated successfully.", { id: toastId });
        setIsEditing(false);
        setUserDetails(data.user);
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("Unable to save changes.", { id: toastId });
      console.log(error);
    }
  };

  const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="user-container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="user-card">
        {userDetails ? (
          <>
            <div className="user-icon">
              <MdAccountCircle size={50} color="#888" style={{ marginRight: "10px" }} />
            </div>
            <h1 className="user-welcome">
              Welcome, {capitalizeName(userDetails.name)}
            </h1>

            {/* Display Email or Phone, depending on what is available */}
            {userDetails.email && !userDetails.phone && (
              <div className="user-info">
                <h3>Email:</h3>
                <p>{userDetails.email}</p>
              </div>
            )}

            {userDetails.phone && !userDetails.email && (
              <div className="user-info">
                <h3>Phone Number:</h3>
                <p>{userDetails.phone}</p>
              </div>
            )}

            {isEditing && (
              <div className="edit-profile-section">
                <input
                  type="text"
                  placeholder="New Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
                <button onClick={handleSaveChanges} className="save-changes-button">
                  Save Changes
                </button>
              </div>
            )}

            <div className="user-orders">
              <h3>Order History</h3>
              {orders.length === 0 ? (
                <p>You have no orders yet.</p>
              ) : (
                <ul>
                  {orders.map((order) => (
                    <li key={order._id} className="order-item">
                      <p>Order ID: {order._id}</p>
                      <p>Status: {order.status}</p>
                      <p>Total: ${order.total}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className="loading">
            <p>Loading user details...</p>
          </div>
        )}
        <div className="user-actions">
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className="edit-profile-button">
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
