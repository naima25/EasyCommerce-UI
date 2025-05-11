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
              title: "Elemis Superfood Midnight Facial, 50ml",
              price: "46.00",
              image: "https://media.johnlewiscontent.com/i/JohnLewis/240516699?fmt=auto&$background-off-white$&wid=640&hei=853"
            },
            { 
              title: "Dior Maximizer Lip Gloss", 
              price: "46", 
              image: "https://media.johnlewiscontent.com/i/JohnLewis/238486903?fmt=auto&$background-off-white$&wid=640&hei=853" 
            },
            { 
              title: "Clarins Super Restorative Night Cream, All Skin Types, 50ml", 
              price: "89.00", 
              image: "https://media.johnlewiscontent.com/i/JohnLewis/241054352alt1?fmt=auto&$background-off-white$&wid=640&hei=853"
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
  ); 
}

export default HomePage;
