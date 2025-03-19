// components/Footer.js
import React from "react";
import SiteInfo from "./SiteInfo";

const Footer = () => {
  return (
    <footer className="text-center mt-4 py-3" style={{ fontSize: "0.85rem", color: "#666" }}>
      <SiteInfo /> {/* Küçük bir yazı olarak göster */}
      <p>© {new Date().getFullYear()} Hacettepe Kebab. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
