// frontend/components/SiteInfo.js
import React, { useEffect, useState } from "react";

const SiteInfo = () => {
  const [siteInfo, setSiteInfo] = useState({
    site_name: "",
    site_url: "",
    support_email: "",
  });

  useEffect(() => {
    fetch("/api/site-info/")
      .then((response) => response.json())
      .then((data) => setSiteInfo(data))
      .catch((error) => console.error("Error fetching site info:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Welcome to {siteInfo.site_name}</h2>
      <p>Visit us at: <a href={siteInfo.site_url}>{siteInfo.site_url}</a></p>
      <p>Support: <a href={`mailto:${siteInfo.support_email}`}>{siteInfo.support_email}</a></p>
    </div>
  );
};

export default SiteInfo;
