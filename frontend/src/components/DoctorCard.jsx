import React from "react";
import "./DoctorCard.css";

const statusColors = {
  available: "#4CAF50", // Green
  "on call": "#FF9800", // Orange
  // You can add more statuses here if needed
};

const DoctorCard = ({ doctor }) => {
  const statusKey = doctor.status.toLowerCase();
  const borderColor = statusColors[statusKey] || "#999";

  return (
    <div className="doctor-card" style={{ borderColor }}>
      <h2 className="doctor-name">{doctor.name}</h2>
      <p className="doctor-specialty">{doctor.specialty}</p>
      {doctor.location && <p className="doctor-location">{doctor.location}</p>}
    </div>
  );
};

export default DoctorCard;