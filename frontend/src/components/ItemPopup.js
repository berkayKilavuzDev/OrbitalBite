import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, updateItem } from "../redux/cartSlice";

const ItemPopup = ({ item, onClose, editingItem }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Eğer kullanıcı düzenleme (edit) modunda açtıysa, verileri ayarla
  useEffect(() => {
    if (editingItem) {
      setQuantity(editingItem.quantity);
      setSelectedOptions(editingItem.options);
    }
  }, [editingItem]);

  const handleOptionChange = (optionId) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(optionId)
        ? prevOptions.filter((id) => id !== optionId)
        : [...prevOptions, optionId]
    );
  };

  const handleAddToCart = () => {
    const payload = {
      id: item.id,
      name: item.name,
      price: item.price,
      options: selectedOptions,
      quantity,
    };

    if (editingItem) {
      dispatch(updateItem({ id: editingItem.id, newOptions: selectedOptions, newQuantity: quantity }));
    } else {
      dispatch(addItem(payload));
    }

    onClose(); // Pop-up kapat
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <h2>{item.name}</h2>
        <p>Price: ${item.price}</p>

        <h3>Options</h3>
        {item.options && item.options.length > 0 ? (
          item.options.map((option) => (
            <div key={option.id}>
              <input
                type="checkbox"
                id={`option-${option.id}`}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
              <label htmlFor={`option-${option.id}`}>{option.name} (+${option.price})</label>
            </div>
          ))
        ) : (
          <p>No options available.</p>
        )}

        <div className="quantity-controls">
          <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        <button className="btn btn-primary" onClick={handleAddToCart}>
          {editingItem ? "Update" : "Add"}
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ItemPopup;
