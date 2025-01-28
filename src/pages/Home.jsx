import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import iphoneBan from "../assets/iphone.jpeg";
import electroBan from "../assets/electronic.jpg";
import fashion from "../assets/fashion.jpg";
import banner from "../assets/banner.png";
import ProductCard from "../components/NavbarFolder/ProductCard";
import BestSellingProducts from "../components/NavbarFolder/BestSellingProducts";
import Categories from "../components/NavbarFolder/Categories";


const Home = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const [showAllProducts, setShowAllProducts] = useState(false); // To show all products in grid for mobile view
  const [carouselIndex, setCarouselIndex] = useState(0); // To track the carousel position
  const [products, setProducts] = useState([]); // State to hold products from backend
  const [bestSellingProducts, setBestSellingProducts] = useState([]); // State to hold best selling products
  const [loading, setLoading] = useState(true); // Loading state to handle async fetching
  const backendUrl = import.meta.env.VITE_BACKEND_URL;  // Backend URL from .env file

  // Function to shuffle and get random products
  const getRandomProducts = (productList, numberOfItems) => {
    if (!Array.isArray(productList)) {
      console.error('Product list is not an array:', productList);
      return [];
    }
    const shuffled = [...productList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfItems);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.shoopers-ecommerce.vercel.app/api/product/list'); // API to fetch products
        const data = await response.json();
        
        if (Array.isArray(data.products)) {
          setProducts(getRandomProducts(data.products, 8)); // Update state with random products
        } else {
          console.error('API did not return an array of products:', data);
        }

        setLoading(false); // Set loading to false once products are fetched
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false); // Set loading to false in case of error as well
      }
    };

    const fetchBestSellingProducts = async () => {
      try {
        const response = await fetch(backendUrl + '/api/product/list'); // API to fetch best-selling products
        const data = await response.json();

        if (Array.isArray(data.products)) {
          const topSellingProducts = data.products.slice(0, 20); // Limit to 20 products
          setBestSellingProducts(topSellingProducts); // Update state with best-selling products
        } else {
          console.error('API did not return an array of best-selling products:', data);
        }
      } catch (error) {
        console.error('Error fetching best-selling products:', error);
      }
    };

    fetchProducts();
    fetchBestSellingProducts(); // Fetch the best-selling products

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (carouselIndex < products.length - 4) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const handlePrev = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  return (
    <div>
      <div className="container my-section">
        <div className="row">
          <div className="col-md-3 categories d-none d-md-block">
            <div className="left-cat">
              <ul className="category-list">
              <li>Women&rsquo;s Fashion <span><b> &rsaquo;</b></span></li>
              <li>Men&rsquo;s Fashion <span><b> &rsaquo;</b></span></li>
              <li>Electronics <span><b> &rsaquo;</b></span></li>
              <li>Home & Lifestyle <span><b> &rsaquo;</b></span></li>
              <li>Medicine <span><b> &rsaquo;</b></span></li>
              <li>Sports & Outdoor <span><b> &rsaquo;</b></span></li>
              <li>Baby&rsquo;s & Toys <span><b> &rsaquo;</b></span></li>
              <li>Groceries & Pets <span><b> &rsaquo;</b></span></li>
              <li>Health & Beauty <span><b> &rsaquo;</b></span></li>
              </ul>
            </div>
          </div>

          <div className="col-md-9">
            <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={iphoneBan} className="d-block w-100" alt="Slide 1" />
                  <div className="carousel-caption">
                    <h5>iPhone 15 Series</h5>
                    <p>Up to 10% off Voucher</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src={electroBan} className="d-block w-100" alt="Slide 2" />
                  <div className="carousel-caption">
                    <h5>Electronics Sale</h5>
                    <p>Best Deals on Electronics</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src={fashion} className="d-block w-100" alt="Slide 3" />
                  <div className="carousel-caption">
                    <h5>Fashion Trends</h5>
                    <p>Shop the Latest Styles</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <Link to={`/category/smartwatch/`} style={{ textDecoration: "none" }}>
                    <img src={banner} className="d-block w-100" alt="Slide 3" />
                  </Link>
                  <div className="carousel-caption">
                    <h5>Hurry Up!!!</h5>
                    <p>Offer ends soon</p>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container flash-sales-section">
        <div className="row justify-content-center">
          <div className="col-md-3 countdown-section">
            <h3>Flash Sale Ends In:</h3>
            <div className="countdown-timer">
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="d-none d-md-flex justify-content-center align-items-center">
            <button className="btn btn-primary prev-arrow" onClick={handlePrev}>
              {"<"}
            </button>
            <div className="d-flex overflow-x-auto" style={{ width: "80%" }}>
              {loading ? (
                <div>Loading...</div>
              ) : (
                products.slice(carouselIndex, carouselIndex + 4).map((product) => (
                  <div key={product._id} className="col-6 col-sm-4 col-md-3 mb-4 product-card">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
            <button className="btn btn-primary next-arrow" onClick={handleNext}>
              {">"}
            </button>
          </div>

          <div className="row d-md-none">
            {loading ? (
              <div>Loading...</div>
            ) : (
              products.slice(0, 4).map((product) => (
                <div key={product._id} className="col-6 col-sm-4 col-md-3 mb-4">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>

          <div className="text-center d-md-none">
            <button className="btn btn-danger" onClick={() => setShowAllProducts(true)}>
              See All Products
            </button>
          </div>

          {showAllProducts && (
            <div className="row">
              {loading ? (
                <div>Loading...</div>
              ) : (
                products.slice(4).map((product) => (
                  <div key={product._id} className="col-6 col-sm-4 col-md-3 mb-4">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Categories />
      
      {/* Pass the best-selling products here */}
      <BestSellingProducts
        products={bestSellingProducts.map((product) => ({
          ...product,
          image: Array.isArray(product.image) ? product.image[0] : product.image, // Ensure image is a string
        }))}
      />
    </div>
  );
};

export default Home;
