import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem, updateItem } from "../redux/cartSlice";
import { fetchOptions, fetchOptionDetails, fetchSideSelections } from "../utils/api";

const ItemPopup = ({ item, onClose, editingItem }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(editingItem ? editingItem.quantity : 1);
    const [selectedOptions, setSelectedOptions] = useState(editingItem ? editingItem.options : []);
    const [selectedOptionDetails, setSelectedOptionDetails] = useState(editingItem ? editingItem.optionDetails : []);
    const [selectedSideItems, setSelectedSideItems] = useState(editingItem ? editingItem.sideItems : []);
    const [optionGroups, setOptionGroups] = useState([]);
    const [sideSelections, setSideSelections] = useState([]);

    useEffect(() => {
        // ✅ Ürüne ve kategoriye özel opsiyonları çek
        fetchOptions(item.id).then((data) => {
            if (data && data.status === "success") {
                setOptionGroups([...data.category_options, ...data.item_options]);
            }
        });

        // ✅ Opsiyon detaylarını çek ve varsayılanları baştan seçili hale getir
        fetchOptionDetails(item.id).then((data) => {
            if (data && data.status === "success") {
                const defaultSelections = data.option_details
                    .filter((detail) => detail.is_default)
                    .map((detail) => detail.id);
                setSelectedOptionDetails(defaultSelections);
            }
        });

        // ✅ Yan ürünleri çek
        fetchSideSelections(item.id).then((data) => {
            if (data && data.status === "success") {
                setSideSelections(data.side_selections);
            }
        });
    }, [item]);

    // ✅ Opsiyonları seçme/kaldırma
    const handleOptionChange = (optionId) => {
        setSelectedOptions((prevOptions) =>
            prevOptions.includes(optionId)
                ? prevOptions.filter((id) => id !== optionId)
                : [...prevOptions, optionId]
        );
    };

    // ✅ Opsiyon detaylarını seçme/kaldırma
    const handleOptionDetailChange = (optionDetailId) => {
        setSelectedOptionDetails((prevDetails) =>
            prevDetails.includes(optionDetailId)
                ? prevDetails.filter((id) => id !== optionDetailId)
                : [...prevDetails, optionDetailId]
        );
    };

    // ✅ Yan ürünleri seçme/kaldırma
    const handleSideItemChange = (sideId) => {
        setSelectedSideItems((prevSideItems) =>
            prevSideItems.includes(sideId)
                ? prevSideItems.filter((id) => id !== sideId)
                : [...prevSideItems, sideId]
        );
    };

    // ✅ Seçili `options` ve `optionDetails` fiyatlarını hesapla
    const extraOptionsPrice = selectedOptions.reduce((sum, optionId) => {
        const option = optionGroups.find((opt) => opt.id === optionId);
        return sum + (option ? option.option_details.reduce((acc, detail) => acc + (parseFloat(detail.price) || 0), 0) : 0);
    }, 0);

    const extraOptionDetailsPrice = selectedOptionDetails.reduce((sum, detailId) => {
        const detail = optionGroups.flatMap(opt => opt.option_details).find(d => d.id === detailId);
        return sum + (detail ? parseFloat(detail.price) || 0 : 0);
    }, 0);

    const extraSideItemsPrice = selectedSideItems.reduce((sum, sideId) => {
        const sideItem = sideSelections.flatMap(sel => sel.side_items).find(s => s.id === sideId);
        return sum + (sideItem ? parseFloat(sideItem.price) || 0 : 0);
    }, 0);

    const basePrice = parseFloat(item.price) || 0;
    const finalPrice = basePrice + extraOptionsPrice + extraOptionDetailsPrice + extraSideItemsPrice;

    const handleAddToCart = () => {
        const payload = {
            id: item.id,
            name: item.name,
            basePrice: basePrice.toFixed(2),
            finalPrice: finalPrice.toFixed(2),
            options: selectedOptions,
            optionDetails: selectedOptionDetails,
            sideItems: selectedSideItems,
            quantity,
        };

        if (editingItem) {
            dispatch(updateItem({ id: editingItem.id, ...payload }));
        } else {
            dispatch(addItem(payload));
        }

        onClose();
    };

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>{item.name}</h2>
                <p>Base Price: £{basePrice.toFixed(2)}</p>

                {/* ✅ Opsiyon Grupları */}
                {optionGroups.length > 0 && (
                    <>
                        <h3>Customize Your {item.name}</h3>
                        {optionGroups.map((option) => (
                            <div key={option.id} className="option-group">
                                <strong>{option.option_name}</strong>
                                <div>
                                    <input
                                        type={option.option_type === "radio" ? "radio" : "checkbox"}
                                        id={`option-${option.id}`}
                                        checked={selectedOptions.includes(option.id)}
                                        onChange={() => handleOptionChange(option.id)}
                                    />
                                    <label htmlFor={`option-${option.id}`}>{option.option_name}</label>
                                </div>

                                {/* ✅ Opsiyon Detaylarını Listele */}
                                {option.option_details.length > 0 && (
                                    <div className="option-details">
                                        {option.option_details.map((detail) => (
                                            <div key={detail.id} className="option-detail">
                                                <input
                                                    type="checkbox"
                                                    id={`detail-${detail.id}`}
                                                    checked={selectedOptionDetails.includes(detail.id)}
                                                    onChange={() => handleOptionDetailChange(detail.id)}
                                                />
                                                <label htmlFor={`detail-${detail.id}`}>
                                                    {detail.optionDetail_name} (+£{parseFloat(detail.price).toFixed(2)})
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {/* ✅ Yan Ürünler (Side Selections) */}
                {sideSelections.length > 0 && (
                    <div>
                        <h3>Side Selections</h3>
                        {sideSelections.map((selection) => (
                            <div key={selection.id}>
                                <h4>{selection.selection_name}</h4>
                                {selection.side_items.map((side) => (
                                    <div key={side.id}>
                                        <input
                                            type="checkbox"
                                            id={`side-${side.id}`}
                                            checked={selectedSideItems.includes(side.id)}
                                            onChange={() => handleSideItemChange(side.id)}
                                        />
                                        <label htmlFor={`side-${side.id}`}>
                                            {side.item_name} (+£{parseFloat(side.price).toFixed(2)})
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                <p>Total Price: £{finalPrice.toFixed(2)}</p>

                <button className="btn btn-primary" onClick={handleAddToCart}>
                    {editingItem ? "Update" : "Add to Basket"}
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ItemPopup;
