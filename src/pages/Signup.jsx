import { useContext, useEffect, useState } from "react";
import "./Signup.css";
import photo from "../assets/login.png";
import googleLogo from "../assets/googlw.png";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import React from 'react';


const Signup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleToggleForm = () => {
    setIsLogin(!isLogin); // Toggle between Login and Signup
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!isLogin) {
        // Signup request
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Account created successfully!");
          setIsLogin(true); // Switch to login form
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Login request
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Logged in successfully!");
          navigate("/home");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    }
  };

  useEffect(()=>{
    if(token){
      navigate('/home')
    }
  })


  return (
    <div className="signup-container">
      <Toaster position="top-center" reverseOrder={false} />
      <img src={photo} className="signup-img" alt="Shopping Cart and Mobile" />

      <div className="signup-form">
        {isLogin ? (
          // Login Form
          <>
            <h1>Log in to your account</h1>
            <p>Enter your details below</p>
            <form onSubmit={onSubmitHandler}>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email or Phone Number"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
              <button type="submit" className="signup-button">
                Log in
              </button>
            </form>
            <button className="google-signup">
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              Log in with Google
            </button>
            <p className="signup-link">
              Don&apos;t have an account?{" "}
              <span onClick={handleToggleForm} style={{ color: "red", cursor: "pointer" }}>
                Sign up
              </span>
            </p>
          </>
        ) : (
          // Signup Form
          <>
            <h1>Create an account</h1>
            <p>Enter your details below</p>
            <form onSubmit={onSubmitHandler}>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
                required
              />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email or Phone Number"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
              <button type="submit" className="signup-button">
                Create Account
              </button>
            </form>
            <button className="google-signup">
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              Sign up with Google
            </button>
            <p className="login-link">
              Already have an account?{" "}
              <span onClick={handleToggleForm} style={{ color: "red", cursor: "pointer" }}>
                Log in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
