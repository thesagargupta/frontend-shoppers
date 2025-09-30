import PropTypes from 'prop-types';
import ProductCard from './ProductCard';


const BestSellingProducts = ({ products, loading = false }) => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Best Selling Products</h2>
      <div className="row">
        {loading ? (
          Array.from({ length: 20 }, (_, i) => (
            <div key={`skeleton-best-${i}`} className="col-6 col-sm-4 col-md-3 mb-4">
              <ProductCard loading={true} />
            </div>
          ))
        ) : (
          products.slice(0, 20).map((product) => (
            <div key={product._id} className="col-6 col-sm-4 col-md-3 mb-4">
              <ProductCard
                product={{
                  ...product,
                  oldPrice: product.oldPrice || 0, // Fallback to 0 if oldPrice is undefined
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// PropTypes validation
BestSellingProducts.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      newprice: PropTypes.number.isRequired,
      oldprice: PropTypes.number.isRequired,
      discount: PropTypes.number,
      rating: PropTypes.number,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

export default BestSellingProducts;
