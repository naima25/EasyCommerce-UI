import React from 'react';
import '../styles/Footer.css'

/*
  Footer.jsx

  This component shows a footer at the bottom of the page.
  It displays the current year and the site name with a copyright notice.
*/

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy;  {new Date().getFullYear()} Easy Commerce. All rights reserved.</p>
    </footer>
  ) 
} 

export default Footer 
