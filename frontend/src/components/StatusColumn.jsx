import React from "react";
import DoctorCard from "./DoctorCard";
import "./StatusColumn.css";

const StatusColumn = ({ title, doctors }) => {
  return (
    <div className="status-column">
      <h1 className="status-title">{title}</h1>
      <div className="doctor-list">
        {doctors.length === 0 ? (
          <p className="no-doctors">No doctors currently {title.toLowerCase()}.</p>
        ) : (
          doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        )}
      </div>
    </div>
  );
};

export default StatusColumn;
