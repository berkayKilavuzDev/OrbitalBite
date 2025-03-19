import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserDetails, fetchUser, changePassword, logoutUser } from "../redux/userSlice";
import { fetchOrderHistory } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.orders.history);
  const orderStatus = useSelector((state) => state.orders.status);
  
  const [activeTab, setActiveTab] = useState("profile"); // Default olarak profil sekmesi aktif
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    postcode: "",
    phone_number: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    } else {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        address: user.address || "",
        postcode: user.postcode || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (activeTab === "orderHistory") {
      dispatch(fetchOrderHistory()); // Sipariş geçmişini çağır
    }
  }, [activeTab, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails(formData));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords do not match.");
      return;
    }
    dispatch(changePassword(passwordData));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <h2>My Account</h2>

      {/* Sekmeler (Profile - Order History - Change Password) */}
      <ul className="nav nav-tabs mt-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "orderHistory" ? "active" : ""}`} onClick={() => setActiveTab("orderHistory")}>
            Order History
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "changePassword" ? "active" : ""}`} onClick={() => setActiveTab("changePassword")}>
            Change Password
          </button>
        </li>
      </ul>

      {/* Profil Sekmesi */}
      {activeTab === "profile" && (
        <div className="mt-4">
          <h4>Personal Details</h4>
          <form onSubmit={handleSubmit}>
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Postcode</label>
                  <input type="text" className="form-control" name="postcode" value={formData.postcode} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" className="form-control" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Update Details</button>
          </form>
        </div>
      )}

      {/* Sipariş Geçmişi Sekmesi */}
      {activeTab === "orderHistory" && (
        <div className="mt-4">
          <h4>Order History</h4>
          {orderStatus === "loading" && <p>Loading...</p>}
          {orderStatus === "failed" && <p className="text-danger">Failed to load order history.</p>}
          {orders.length === 0 ? (
            <p>No previous orders found.</p>
          ) : (
            <ul className="list-group">
              {orders.map((order) => (
                <li key={order.id} className="list-group-item">
                  <strong>Order #{order.id}</strong> - {order.date}
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>{item.name} - {item.quantity} x £{item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                  <strong>Total:</strong> £{order.total_price.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Şifre Değiştirme Sekmesi */}
      {activeTab === "changePassword" && (
        <div className="mt-4">
          <h4>Change Password</h4>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" className="form-control" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" className="form-control" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" className="form-control" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} required />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Update Password</button>
          </form>
        </div>
      )}

      {/* Çıkış Yap Butonu */}
      <div className="mt-4 text-center">
        <button type="button" className="btn btn-danger" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default Account;
