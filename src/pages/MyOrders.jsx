import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5172/api/order');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);


  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5172/api/order/${orderId}`);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      console.log(`Order ${orderId} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete order ${orderId}:`, error);
    }
  };

  return (
    <div>
      <h1>My Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <strong>ID:</strong> {order.id} <br />
              <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()} <br />
              <strong>Total:</strong> ${order.totalAmount.toFixed(2)} <br />
              <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
