import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext(null);

// Helper function to initialize the cart
const GetDefaultCart = (products) => {
  const cart = {};
  products.forEach((product) => {
    cart[product._id] = 0;
  });
  return cart;
};

const ShopContextProvider = ({ children }) => {
  const [CartItem, SetCartItem] = useState({});
  const [Search, SetSearch] = useState("");
  const [ShowSearch, SetShowSearch] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(""); // Token for authentication
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL // Backend URL from .env file

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          const backendProducts = response.data.products.map((product) => ({
            ...product,
            oldPrice: product.oldprice || null, // Consistent naming for oldPrice
          }));
          setProducts(backendProducts);

          // Initialize the cart with default values if empty
          SetCartItem((prev) => {
            if (Object.keys(prev).length === 0) {
              return GetDefaultCart(backendProducts);
            }
            return prev; // Keep the current cart if already initialized
          });
        } else {
          console.error("Failed to fetch products:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  // Sync user cart with the backend
  const syncUserCart = async () => {
    if (!token) return; // Only sync if the user is authenticated

    try {
      const response = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const backendCart = response.data.cart;
        SetCartItem((prev) => {
          const syncedCart = { ...prev };
          backendCart.forEach((item) => {
            syncedCart[item.itemId] = item.quantity;
          });
          return syncedCart;
        });
      } else {
        console.error("Failed to fetch user cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error syncing user cart:", error.response?.data || error.message);
    }
  };

  // Call syncUserCart when token changes
  useEffect(() => {
    if (token) {
      syncUserCart();
    }
  }, [token]);

  // Add item to the cart and update backend
  const AddToCart = async (itemId, quantity = 1) => {
    if (!token) {
      console.log("Not logged in, redirecting to login page...");
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    // Optimistically update local state
    SetCartItem((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + quantity,
    }));

    try {
      // Send API request to add to the cart
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        console.error("Failed to update cart:", response.data.message);
        syncUserCart(); // Sync cart if the API fails
      }
    } catch (error) {
      console.error("Error adding item to cart:", error.response?.data || error.message);
      syncUserCart(); // Rollback on failure
    }
  };
// Updated RemoveFromCart to decrease quantity instead of removing immediately
const RemoveFromCart = async (itemId) => {
  if (!token) return;

  const currentQuantity = CartItem[itemId] || 0;
  if (currentQuantity <= 0) return;

  try {
    const newQuantity = currentQuantity - 1;

    const response = await axios.post(
      `${backendUrl}/api/cart/update`,
      { itemId, quantity: newQuantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      SetCartItem((prev) => {
        const newCart = { ...prev };
        if (newQuantity === 0) {
          delete newCart[itemId];
        } else {
          newCart[itemId] = newQuantity;
        }
        return newCart;
      });
    } else {
      console.error("Failed to update cart:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating cart:", error.response?.data || error.message);
  }
};

const DeleteItemFromCart = async (itemId) => {
  if (!token) return;

  try {
    const response = await axios.post(
      `${backendUrl}/api/cart/remove`, // Assuming your backend has a /remove endpoint
      { itemId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      SetCartItem((prev) => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });
    } else {
      console.error("Failed to delete item from cart:", response.data.message);
    }
  } catch (error) {
    console.error("Error deleting item from cart:", error.response?.data || error.message);
  }
};


  // Clear the cart
  const clearCart = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        SetCartItem(GetDefaultCart(products));
      } else {
        console.error("Failed to clear cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error clearing cart:", error.response?.data || error.message);
    }
  };

  // Get total items in the cart
  const getTotalItems = () =>
    Object.values(CartItem).reduce((total, quantity) => total + quantity, 0);

  // Search functionality
  useEffect(() => {
    if (!Search.trim()) {
      setFilteredProducts([]);
      return;
    }

    const formattedSearch = Search.trim().replace(/\s+/g, "").toLowerCase();
    const filtered = products.filter((product) => {
      const formattedProductName = product.name.replace(/\s+/g, "").toLowerCase();
      const formattedCategory = product.category
        ? product.category.replace(/\s+/g, "").toLowerCase()
        : "";
      return (
        formattedProductName.includes(formattedSearch) ||
        formattedCategory.includes(formattedSearch)
      );
    });

    setFilteredProducts(filtered);
  }, [Search, products]);

  // Perform search and navigate to results page
  const performSearch = () => {
    if (!Search.trim()) {
      console.error("Search query is empty.");
      return;
    }
    navigate("/search-results", { state: { products: filteredProducts } });
  };

  // Sync token with local storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Save token to localStorage
  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const contextValue = {
    products,
    filteredProducts,
    CartItem,
    AddToCart,
    RemoveFromCart,
    clearCart,
    getTotalItems,
    navigate,
    ShowSearch,
    SetShowSearch,
    Search,
    SetSearch,
    performSearch,
    setToken,
    token,
    backendUrl,
    saveTokenToLocalStorage,
    SetCartItem,
    DeleteItemFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
