import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { useSearchParams } from "react-router-dom";
import "../style.css";

const Menu = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category"); // URL'den kategori al
  
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const basket = useSelector((state) => state.cart.items);

  // API'den kategorileri ve menüyü çek
  useEffect(() => {
    fetch("/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("/api/menu-items/")
      .then((res) => res.json())
      .then((data) =>{
        console.log("Menu Items:", data);
        setMenuItems(data)
      });     
  }, []);

  const handleAddToBasket = (item) => {
    dispatch(addItem(item));
  };

  return (
    <div className="menu-page">
      {/* 🟢 Kategori Filtreleri */}
      <div className="category-filter">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`?category=${category.name.toLowerCase()}`}
            className={`category-btn ${selectedCategory === category.name.toLowerCase() ? "active" : ""}`}
          >
            {category.name}
          </a>
        ))}
      </div>

      {/* 🔵 Menü Öğeleri */}
      <div className="menu-container">
        {categories.map((category) =>
          (!selectedCategory || selectedCategory === category.name.toLowerCase()) ? (
            <div key={category.id} className="category-section">
              <h2>{category.name}</h2>
              <div className="menu-grid">
                {menuItems
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <div key={item.id} className="menu-item-card">
                      <img src={item.image_url} alt={item.name} className="menu-item-image" />
                      <h4>{item.name}</h4>
                      <p className="price">${item.price.toFixed(2)}</p>
                      <button className="btn btn-primary" onClick={() => handleAddToBasket(item)}>
                        Add to Cart
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* 🛒 Sepet */}
      <div className="basket-container">
        <h2>Your Basket</h2>
        <ul className="basket-list">
          {basket.map((item, index) => (
            <li key={index} className="basket-item">
              <span>{item.name}</span>
              <span className="price">${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
