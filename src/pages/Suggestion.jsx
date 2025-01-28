import { useState, useEffect, useContext } from 'react'; 
import ProductCard from '../components/navbar/ProductCard';
import { ShopContext } from '../context/ShopContext'; // Import the ShopContext
import React from 'react';


const Suggestion = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const { products } = useContext(ShopContext); // Fetch products from the context

  const getRandomProducts = (productList, numberOfItems) => {
    const shuffled = [...productList].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, numberOfItems); 
  };

  useEffect(() => {
    if (products.length > 0) {
      // Filter out manually added products
      const backendProducts = products.filter(product => !product.id); // Assuming backend products don't have an id (or use a different identifier)
      
      const selectedProducts = getRandomProducts(backendProducts, 4); 
      setRandomProducts(selectedProducts); // Set them in the state
    }
  }, [products]);

  return (
    <div>
      <div className="container my-5">
        <h2 className="text-center mb-4">Suggested For You</h2>
        <div className="row">
          {randomProducts.map((product) => (
            <div key={product._id} className="col-6 col-sm-4 col-md-3 mb-4"> {/* Changed id to _id */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
