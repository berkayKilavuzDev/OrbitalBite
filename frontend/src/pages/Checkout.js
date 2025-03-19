import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { submitOrder } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const cart = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [orderInstructions, setOrderInstructions] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !deliveryDate || !deliveryTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const orderData = {
      address,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      instructions: orderInstructions,
      items: cart,
      total_price: totalPrice,
    };

    try {
      const resultAction = await dispatch(submitOrder(orderData));

      if (submitOrder.fulfilled.match(resultAction)) {
        dispatch(clearCart()); // ✅ Sepeti temizle
        navigate("/order-complete"); // ✅ Sipariş tamamlandı sayfasına yönlendir
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Delivery Date</label>
          <input
            type="date"
            className="form-control"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Delivery Time</label>
          <input
            type="time"
            className="form-control"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Order Instructions</label>
          <textarea
            className="form-control"
            value={orderInstructions}
            onChange={(e) => setOrderInstructions(e.target.value)}
          />
        </div>
        <h4>Total: £{totalPrice.toFixed(2)}</h4>
        <button type="submit" className="btn btn-primary">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
