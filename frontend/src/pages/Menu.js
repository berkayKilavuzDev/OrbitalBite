import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, updateItem, removeItem } from "../redux/cartSlice";
import { useSearchParams } from "react-router-dom";
import "../style.css";
import { fetchCategories, fetchMenuItems } from "../utils/api";
import ItemPopup from "../components/ItemPopup";
import Basket from "../components/Basket";

const Menu = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category");

    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchCategories().then((data) => {
            if (data && data.status === "success") setCategories(data.categories);
        });

        fetchMenuItems().then((data) => {
            if (data && data.status === "success") setMenuItems(data.menu);
        });
    }, []);

    const openPopup = (item) => {
        setSelectedItem(item);
    };

    const closePopup = () => {
        setSelectedItem(null);
    };

    return (
        <div className="menu-page container">
            <div className="row">
                <div className="col-md-3 category-menu">
                    <h2>Categories</h2>
                    {categories.map((category) => (
                        <div key={category.id} className="list-group">
                            <a href={`?category=${category.name}`} className="list-group-item list-group-item-action">
                                {category.name}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="col-md-6 menu-items">
                    <h2>Menu</h2>
                    {categories.map((category) =>
                        (!selectedCategory || selectedCategory === category.name) ? (
                            <div key={category.id} className="category-section">
                                <hr />
                                <h4>{category.name}</h4>
                                {menuItems
                                    .filter((item) => item.category === category.name)
                                    .map((item) => (
                                        <div key={item.id} className="card menu-item">
                                            {item.photo ? (
                                                <img src={item.photo} className="card-img-top" alt={item.name} />
                                            ) : (
                                                <div className="no-image">No Image</div>
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{item.name}</h5>
                                                <p className="card-text">£{parseFloat(item.price).toFixed(2)}</p>
                                                <button className="btn btn-primary" onClick={() => openPopup(item)}>Customize</button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : null
                    )}
                </div>
                
                <div className="col-md-3 cart-section">
                    <Basket />
                </div>
            </div>
            {selectedItem && <ItemPopup item={selectedItem} onClose={closePopup} />}
        </div>
    );
};

export default Menu;
