import React from "react";

const NotFound = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary mt-3">Go to Home</a>
    </div>
  );
};

export default NotFound;
