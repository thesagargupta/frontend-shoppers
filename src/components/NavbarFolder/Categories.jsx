import { Link } from "react-router-dom";
import "./Categories.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { IoWatch } from "react-icons/io5";
import { FaHeadphones } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";

const Categories = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { name: "Phones", icon:<FontAwesomeIcon icon={faMobileScreenButton} style={{ color: 'black' }}/>, path: "phones" },
    { name: "Computers", icon: <FontAwesomeIcon icon={faComputer} style={{ color: 'black' }}/>, path: "computers" },
    { name: "SmartWatch", icon: <IoWatch style={{ color: 'black' }}/>, path: "smartwatch" },
    { name: "Camera", icon:<FaCamera style={{ color: 'black' }}/>, path: "camera" },
    { name: "HeadPhones", icon: <FaHeadphones style={{ color: 'black' }}/>, path: "headphones" },
    { name: "Gaming", icon: <IoGameController style={{ color: 'black' }}/>, path: "gaming" },
    { name: "HomeNeeds", icon: <IoHome style={{ color: 'black' }}/>, path: "homeneeds" },
  ];

  return (
    <div className="categories-section">
      <h3 className="section-title">Categories</h3>
      <h2 className="section-subtitle">Browse By Category</h2>
      <div className="categories-list">
        {categories.map((category, index) => (
          <Link
            to={`/category/${category.path}`}
            key={index}
            className="category-item"
            onClick={handleLinkClick}  // Add onClick event here
          >
            <span className="category-icon">{category.icon}</span>
            <p className="category-name">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
