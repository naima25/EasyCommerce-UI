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
              title: "Yves Saint Laurent Rouge Pur Couture Lipstick",
              price: "36.00",
              image: "https://media.johnlewiscontent.com/i/JohnLewis/111119525?fmt=auto&$background-off-white$&wid=640&hei=853"
            },
            { 
              title: "ERDEM Double Breasted Twill Blazer", 
              price: "1795.00", 
              image: "https://media.johnlewiscontent.com/i/JohnLewis/009833409alt3?fmt=auto&$background-off-white$&wid=640&hei=853" 
            },
            { 
              title: "Nars: Dolce blush", 
              price: "27.00", 
              image: "https://media.johnlewiscontent.com/i/JohnLewis/111530320?fmt=auto&$background-off-white$&wid=640&hei=853"
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
