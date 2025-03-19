import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../redux/slices/userSlice"; // Redux'taki signup action'ı
import "./Signup.css"; // Stil dosyası (isteğe bağlı)

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form inputlarını güncelleme fonksiyonu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await dispatch(signupUser(formData)).unwrap(); // Redux action çağır
      if (response.success) {
        navigate("/account"); // Başarılı olursa hesabına yönlendir
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-header">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password1" className="form-control" value={formData.password1} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" name="password2" className="form-control" value={formData.password2} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
      </form>
      <div className="text-center mt-3">
        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};

export default Signup;
