import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Breadcrumbs.css';


const Breadcrumbs = ({ category, productName }) => {
  
  return (
    <div className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">Home</Link> &gt;
      <Link to={`/category/${category}`} className="breadcrumb-link">{category}</Link>
      {productName && (
        <>
          &gt; <span>{productName}</span>
        </>
      )}
    </div>
  );
};

Breadcrumbs.propTypes = {
  category: PropTypes.string.isRequired, // Category is required
  productName: PropTypes.string,         // Product name is optional
};

export default Breadcrumbs;
