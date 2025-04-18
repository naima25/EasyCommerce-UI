// src/pages/Home.jsx
import React from 'react';
import '../styles/Home.css'; 

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Easy Commerce!</h1>
        <p className="slogan">Your one-stop shop for all your needs.</p>
      </header>

      <section className="home-content">
        <h2>Explore Categories</h2>
        <p>Browse through our wide variety of categories to find what you're looking for.</p>
      </section>
    </div>
  );
};

export default Home;
