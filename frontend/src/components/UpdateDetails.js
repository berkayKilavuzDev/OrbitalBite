import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../redux/slices/userSlice";

const UpdateDetails = () => {
  const dispatch = useDispatch();
  const [details, setDetails] = useState({ email: "", phone: "", address: "" });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails(details));
  };

  return (
    <div className="mt-4">
      <h3>Update Details</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="Email" onChange={handleChange} className="form-control mb-2" />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} className="form-control mb-2" />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} className="form-control mb-2" />
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default UpdateDetails; 
