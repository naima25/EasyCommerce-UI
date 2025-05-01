import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';  // Corrected import for CartProvider      
import { AppProvider } from './context/AppContext';     

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> 
      <AppProvider> 
        <App />
      </AppProvider>
    </CartProvider>
  </StrictMode>
);
