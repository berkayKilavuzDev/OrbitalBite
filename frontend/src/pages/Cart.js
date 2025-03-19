import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  setEditingItem,
} from "../redux/cartSlice";
import ItemPopup from "../components/ItemPopup";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [showPopup, setShowPopup] = useState(false);

  const handleEdit = (item) => {
    dispatch(setEditingItem(item));
    setShowPopup(true);
  };

  return (
    <div className="cart">
      <h2>Basket</h2>
      {cart.items.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <ul className="cart-items">
          {cart.items.map((item) => (
            <li key={item.id} className="cart-item">
              <div>
                <strong>{item.name}</strong>
                {item.options.length > 0 && (
                  <p>
                    Options:{" "}
                    {item.options.map((opt, index) => (
                      <span key={index}>{opt}{index < item.options.length - 1 ? ", " : ""}</span>
                    ))}
                  </p>
                )}
              </div>
              
              <div className="quantity-controls">
                <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
              </div>

              <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>

              <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
              <button className="btn btn-danger" onClick={() => dispatch(removeItem(item.id))}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      
      <h3>Total: ${cart.totalPrice.toFixed(2)}</h3>

      {showPopup && <ItemPopup item={cart.editingItem} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Cart;
