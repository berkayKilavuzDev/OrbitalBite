import React from "react"; 
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import logo from "../assets/images/logo.png"; // Logo yolu

const NavBar = () => {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Logo ve Ana Sayfa Linki */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Istanbul Kebab" className="navbar-logo" style={{ height: "50px", width: "auto", marginRight: "10px" }} />
          Istanbul Kebab
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/menu" className="nav-link">Order Now</Link>
            </li>
            <li className="nav-item">
              <Link to="/account" className="nav-link">Account</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link">Cart</Link>
            </li>

            {user ? (
              <li className="nav-item">
                <Logout />
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
