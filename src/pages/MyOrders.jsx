import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/Orders.css';

const OrdersPage = () => {
  const { orders, loading, error } = useAppContext();

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="orders-page">
      <h1 className="orders-title">Your Orders</h1>
      
      {orders?.length > 0 ? (
        <div>
          {orders.map((order) => (
            <div key={order.id} className="order">
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>Total: ${order.price.toFixed(2)}</p>
              </div>
              
              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div key={`${order.id}-${item.productId}`} className="order-item">
                    <img
                      src={item.product?.imageUrl || 'placeholder-image-url'}
                      alt={item.product?.name || 'Product'}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h4>{item.product?.name || 'Unknown Product'}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.product?.price?.toFixed(2) || '0.00'}</p>
                      <p>Subtotal: ${(item.quantity * (item.product?.price || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't placed any orders yet.</p>
      )}
    </div>
  );
};

export default OrdersPage;