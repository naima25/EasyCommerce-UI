import React from "react";
import { Link } from "react-router-dom"; // Import Link component for routing
import "../styles/Home.css";

function HomePage() {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Welcome to Easy Commerce</h1>
        <p>Shop the latest products at the best prices</p>
        <Link to="/our-products" className="browse-collections-link">Browse Collections</Link>
      </header>

      <section className="cards-section">
        <h2>Featured Products</h2>
        <div className="card-grid">
          {[
            {
              title: "Gaming Headset",
              price: "89.99",
              image: "https://m.media-amazon.com/images/I/71rwPzXKDGL._AC_SL1500_.jpg"
            },
            { 
              title: "Standing Desk", 
              price: "59.99", 
              image: "https://m.media-amazon.com/images/I/61xrbRLOmZL.__AC_SY300_SX300_QL70_ML2_.jpg" 
            },
            { 
              title: "Effaclar Serum", 
              price: "39.99", 
              image: "https://www.laroche-posay.co.uk/dw/image/v2/AAQP_PRD/on/demandware.static/-/Sites-lrp-ng-master-catalog/en_GB/dwab542d6c/LRP_Product/Effaclar/3337875722827_EFFACLAR-SERUM_30ml_01_La-Roche-Posay.jpg" 
            }
          ].map((product, index) => (
            <div key={index} className="card">
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ); // ✅ Closing the return JSX here
}

export default HomePage;
