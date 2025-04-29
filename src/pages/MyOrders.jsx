// src/pages/MyOrders.jsx
import React, { useEffect, useState } from 'react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  // Example of fetching orders or loading from context/state
  useEffect(() => {
    const fetchedOrders = [
      { id: 1, orderDate: '2025-04-14', totalAmount: 70 },
      { id: 2, orderDate: '2025-04-15', totalAmount: 120 },
    ];
    setOrders(fetchedOrders);
  }, []);

  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Order Date: {order.orderDate}</p>
            <p>Total Amount: ${order.totalAmount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders;
