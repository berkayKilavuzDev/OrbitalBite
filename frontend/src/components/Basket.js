import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateItem, removeItem } from "../redux/cartSlice";
import ItemPopup from "../components/ItemPopup";

const Basket = () => {
    const dispatch = useDispatch();
    const basket = useSelector((state) => state.cart.items) || [];
    const [deliveryMethod, setDeliveryMethod] = useState("pickup");
    const [pickupTime, setPickupTime] = useState("ASAP (15 minutes)");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    // ✅ Ürün miktarını artır/azalt
    const handleQuantityChange = (item, amount) => {
        if (item.quantity + amount > 0) {
            dispatch(updateItem({ 
                id: item.id, 
                newQuantity: item.quantity + amount,
                newOptions: item.options,
                newOptionDetails: item.optionDetails,
                newSideSelections: item.sideSelections
            }));
        }
    };

    // ✅ Sepetten ürün kaldır
    const handleRemoveItem = (itemId) => {
        dispatch(removeItem(itemId));
    };

    // ✅ Sepetteki ürün için düzenleme ekranını aç
    const openPopup = (item) => {
        setSelectedItem({
            ...item,
            options: item.options || [],
            optionDetails: item.optionDetails || [],
            sideSelections: item.sideSelections || [],
            size: item.size || "",
        });
    };

    // ✅ Pop-up ekranını kapat
    const closePopup = () => {
        setSelectedItem(null);
    };

    // ✅ Toplam fiyatı hesapla
    const totalPrice = basket
        .reduce((sum, item) => sum + parseFloat(item.finalPrice) * item.quantity, 0)
        .toFixed(2);

    return (
        <div className="basket-container">
            {/* 🚀 Teslimat veya Pick-up Seçimi */}
            <div className="delivery-method">
                <button className={deliveryMethod === "delivery" ? "active" : ""} 
                        onClick={() => setDeliveryMethod("delivery")}>
                    Delivery
                </button>
                <button className={deliveryMethod === "pickup" ? "active" : ""} 
                        onClick={() => setDeliveryMethod("pickup")}>
                    Pick-up
                </button>
            </div>

            {/* 🚀 Pick-up için zaman seçimi */}
            {deliveryMethod === "pickup" ? (
                <div className="pickup-time">
                    <label>Pickup Time:</label>
                    <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
                        <option>ASAP (15 minutes)</option>
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                    </select>
                </div>
            ) : (
                <div className="delivery-address">
                    <label>Delivery Address:</label>
                    <input 
                        type="text" 
                        value={deliveryAddress} 
                        onChange={(e) => setDeliveryAddress(e.target.value)} 
                        placeholder="Enter your address" 
                    />
                </div>
            )}

            <h2>Your Order</h2>
            {basket.length === 0 ? <p>Your basket is empty.</p> : (
                basket.map((item, index) => (
                    <div key={index} className="basket-item">
                        <h3>{item.name}</h3>
                        <p><strong>Size:</strong> {item.size}</p>

                        {/* 🚀 Seçili Opsiyonları Listele */}
                        {item.options.length > 0 && (
                            <div>
                                <strong>Options:</strong>
                                <ul>
                                    {item.options.map((option, i) => (
                                        <li key={i}>{option.option_name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 🚀 Seçili Opsiyon Detaylarını Listele */}
                        {item.optionDetails.length > 0 && (
                            <div>
                                <strong>Selected Option Details:</strong>
                                <ul>
                                    {item.optionDetails.map((detail, i) => (
                                        <li key={i}>{detail.optionDetail_name} (+£{parseFloat(detail.price).toFixed(2)})</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 🚀 Yan Ürünleri Listele */}
                        {item.sideSelections && item.sideSelections.length > 0 && (
                            <div>
                                <strong>Side Selections:</strong>
                                <ul>
                                    {item.sideSelections.map((side, i) => (
                                        <li key={i}>{side.name} (+£{parseFloat(side.price).toFixed(2)})</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 🚀 Sepet Ürün Kontrolleri */}
                        <div className="item-controls">
                            <button onClick={() => handleRemoveItem(item.id)}>🗑️</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                            <button onClick={() => openPopup(item)}>✏️ Edit</button>
                        </div>

                        {/* 🚀 Fiyat Bilgisi */}
                        <p className="price">£{(parseFloat(item.finalPrice) * item.quantity).toFixed(2)}</p>
                    </div>
                ))
            )}

            <button className="checkout-button">Checkout £{totalPrice}</button>

            {/* 🚀 Ürün Düzenleme için Pop-up */}
            {selectedItem && <ItemPopup item={selectedItem} onClose={closePopup} editingItem={selectedItem} />}
        </div>
    );
};

export default Basket;
