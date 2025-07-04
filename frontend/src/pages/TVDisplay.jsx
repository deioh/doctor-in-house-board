import React, { useEffect, useState } from 'react';
import '../DoctorBoard.css';

const TVDisplay = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3004/api/doctors');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div className="doctor-board__loading">Loading doctors...</div>;
  if (error) return <div className="doctor-board__error">Error: {error}</div>;

  return (
    <div className="doctor-board">
      <h2 className="doctor-board__title">Doctors On Board</h2>
      <div className="doctor-board__cards">
        {doctors.map(({ id, name, specialty, status }) => (
          <div key={id} className="doctor-card">
            <h3 className="doctor-card__name">{name}</h3>
            <p className="doctor-card__specialty">
              <strong>Specialty:</strong> {specialty}
            </p>
            <p className="doctor-card__status">
              <strong>Status:</strong>
              <span className={`status ${status.toLowerCase().replace(/\s/g, '-')}`}>
                {status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TVDisplay;