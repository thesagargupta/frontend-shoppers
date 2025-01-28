import './Error.css'
import { NavLink } from "react-router-dom";
import React from 'react';


const Error = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div>
     <div className="corner">
        <p className='Home'><NavLink to="/" onClick={handleLinkClick}>Home </NavLink> &gt; Error</p>
     </div>
     <div className="main-cont">
        <div className="error-msg">
            <h1 className='head'>404 Not Found</h1>
        </div>
        <div className="message">
        <p className='message'>Your visited page not found. You may go home page.</p>
        </div>
        <div className="home-back">
        <NavLink to="/">
            <button className='back-btn' onClick={handleLinkClick}>Back to home page</button>
          </NavLink>
        </div>
     </div>
    </div>
  )
}

export default Error
