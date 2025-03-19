// components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="text-center mt-4 py-3" style={{ fontSize: "0.85rem", color: "#666" }}>
      <p>© {new Date().getFullYear()} Hacettepe Kebab. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
