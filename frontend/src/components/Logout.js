import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login"); // Çıkış yaptıktan sonra giriş sayfasına yönlendir
  };

  return (
    <button className="btn btn-danger ml-3" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
