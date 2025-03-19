import React from "react";

const Contact = () => {
  return (
    <div className="container mt-5">
      <h1>Restaurant Name</h1>
      <div className="row mt-4">
        {/* Opening Hours */}
        <div className="col-md-8">
          <h4>Opening Hours</h4>
          <div className="row">
            <div className="col">
              <p><strong>Monday:</strong></p>
              <p><strong>Tuesday:</strong></p>
              <p><strong>Wednesday:</strong></p>
              <p><strong>Thursday:</strong></p>
              <p><strong>Friday:</strong></p>
              <p><strong>Saturday:</strong></p>
              <p><strong>Sunday:</strong></p>
            </div>
            <div className="col">
              <p>10:00 AM - 10:00 PM</p>
              <p>10:00 AM - 10:00 PM</p>
              <p>10:00 AM - 10:00 PM</p>
              <p>10:00 AM - 10:00 PM</p>
              <p>10:00 AM - 11:00 PM</p>
              <p>10:00 AM - 11:00 PM</p>
              <p>Closed</p>
            </div>
          </div>
        </div>

        {/* Address and Contact */}
        <div className="col-md-4">
          <h4>Address</h4>
          <p>123 Main Street</p>
          <p>City, State, ZIP</p>

          <div className="mt-5">
            <h4>Telephone</h4>
            <p>(123) 456-7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
