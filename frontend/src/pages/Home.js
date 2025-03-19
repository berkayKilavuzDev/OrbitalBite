import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice"; // Sepete ekleme
import { useNavigate } from "react-router-dom";
import "../style.css"; // CSS stilleri

import heroImage from "../assets/images/hero.jpg"; // Arka plan resmi
import burgerImg from "../assets/images/burger.jpg";
import kebabImg from "../assets/images/kebab.jpg";
import donerImg from "../assets/images/doner.jpg";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [basket, setBasket] = useState([]);

  // API'den kategorileri ve menüyü çek
  useEffect(() => {
    fetch("/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("/api/menu-items/")
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
  }, []);

  // Sepete ekleme işlemi
  const handleAddToBasket = (item) => {
    dispatch(addItem(item));
    setBasket([...basket, item]);
  };

  return (
    <div 
      className="home-container" 
      style={{ 
        backgroundImage: `url(${heroImage})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        height: "50vh", 
        color: "white"
      }}
    >
      {/* 🟠 Banner Bölümü */}
      <div className="banner">
        <h1>Delicious Food, Delivered Fast!</h1>
        <p>Order your favorite meals with just one click.</p>
        <button className="order-now-btn" onClick={() => navigate("/menu")}>
          ORDER NOW
        </button>
      </div>

      {/* 🟢 Yemek Kategorileri */}
      <div className="category-container">
        <div className="category-card" onClick={() => navigate("/menu?category=burger")}>
          <img src={burgerImg} alt="Burger" />
          <h3>Burger</h3>
        </div>
        <div className="category-card" onClick={() => navigate("/menu?category=kebab")}>
          <img src={kebabImg} alt="Kebab" />
          <h3>Kebab</h3>
        </div>
        <div className="category-card" onClick={() => navigate("/menu?category=doner")}>
          <img src={donerImg} alt="Döner" />
          <h3>Döner</h3>
        </div>
      </div>

      {/* 🔵 Menü Öğeleri */}
      <div className="menu-container">
        <h2>Menu</h2>
        {categories.map((category) => (
          <div key={category.id} className="category" id={`category-${category.id}`}>
            <h4>{category.name}</h4>
            {menuItems
              .filter((item) => item.category === category.id)
              .map((item) => (
                <div key={item.id} className="menu-item-card">
                  <h5>{item.name}</h5>
                  <p>${item.price.toFixed(2)}</p>
                  <button onClick={() => handleAddToBasket(item)} className="btn btn-primary">
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* 🛒 Sepet */}
      <div className="basket-container">
        <h2>Basket</h2>
        <div className="basket-card">
          <ul className="basket-list">
            {basket.map((item, index) => (
              <li key={index} className="basket-item">
                <span>{item.name}</span>
                <span className="price">${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="basket-footer">
            <button className="btn btn-primary" onClick={() => navigate("/checkout")}>
              Checkout
            </button>
            <h5>Total: ${basket.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
