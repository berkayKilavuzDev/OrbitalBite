import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../redux/slices/userSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changePassword(passwords));
  };

  return (
    <div className="mt-4">
      <h3>Change Password</h3>
      <form onSubmit={handleSubmit}>
        <input type="password" name="oldPassword" placeholder="Old Password" onChange={handleChange} className="form-control mb-2" />
        <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} className="form-control mb-2" />
        <button type="submit" className="btn btn-primary">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
