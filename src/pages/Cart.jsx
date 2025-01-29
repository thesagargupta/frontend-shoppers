import Cart_Items from './Cart_Items'; 
import { NavLink } from "react-router-dom";
import "./Cart.css"


const Cart = () => {
  return (
    <div className='product-page'>
      <h1 className='head-cart'>Your Cart</h1>
      <div className="corner">
        <p className="Home">
          <NavLink to="/">Home </NavLink>/ Cart
        </p>
      </div>
      <Cart_Items /> 
    </div>
  );
};

export default Cart;
