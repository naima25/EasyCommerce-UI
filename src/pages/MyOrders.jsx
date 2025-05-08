import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/Orders.css';

const OrdersPage = () => {
  const { orders, loading, error, cancelOrder, updateOrderItemQuantity, removeOrderItem } = useAppContext();
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleUpdateQuantity = async (orderId, orderItemId) => {
    const success = await updateOrderItemQuantity(orderId, orderItemId, newQuantity);
    if (success) {
      setEditingItem(null);
    }
  };

  return (
    <div className="orders-page">
      <h1 className="orders-title">Your Orders</h1>
      
      {orders?.length > 0 ? (
        <div>
          {orders?.map((order) => (
            <div key={order.id} className="order">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="order-actions">
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        await cancelOrder(order.id);
                      }
                    }}
                    className="cancel-order-button"
                  >
                    Cancel Order
                  </button>
                  <p className="order-total">Total: ${order.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="order-items">
                {order?.orderItems?.map((item) => (
                  <div key={`${order.id}-${item.id}`} className="order-item">
                    <img
                      src={item.product?.imageUrl || 'placeholder-image-url'}
                      alt={item.product?.name || 'Product'}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h4>{item.product?.name || 'Unknown Product'}</h4>
                      {editingItem === item.id ? (
                        <div className="quantity-edit">
                          <input
                            type="number"
                            min="1"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(parseInt(e.target.value))}
                            className="quantity-input"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(order.id, item.id)}
                            className="save-quantity-button"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="cancel-edit-button"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="quantity-display">
                          <span>Quantity: {item.quantity}</span>
                          <button
                            onClick={() => {
                              setEditingItem(item.id);
                              setNewQuantity(item.quantity);
                            }}
                            className="edit-quantity-button"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                      <p>Price: ${item.product?.price?.toFixed(2) || '0.00'}</p>
                      <p>Subtotal: ${(item.quantity * (item.product?.price || 0)).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to remove this item from the order?')) {
                          await removeOrderItem(order.id, item.id);
                        }
                      }}
                      className="remove-order-item-button"
                    >
                      Remove
                    </button>
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