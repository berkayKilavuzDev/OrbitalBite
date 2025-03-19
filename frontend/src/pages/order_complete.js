import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderComplete = () => {
  const orderData = useSelector((state) => state.order.lastOrder); // Redux'tan son siparişi al

  return (
    <div className="container text-center mt-5">
      <h2 className="text-success">Your Order is Complete! 🎉</h2>
      <p className="mt-3">Thank you for your order. You will receive a confirmation email shortly.</p>

      <div className="mt-4">
        <h4>Order Summary</h4>
        <ul className="list-group mt-3">
          {orderData?.items?.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{item.name} x {item.quantity}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <h5 className="mt-3">Total: £{orderData?.total?.toFixed(2)}</h5>
      </div>

      <div className="mt-4">
        <Link to="/menu" className="btn btn-primary">Order Again</Link>
        <Link to="/order-history" className="btn btn-secondary">View Order History</Link>
      </div>
    </div>
  );
};

export default OrderComplete;
