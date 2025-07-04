import { useState, useEffect } from 'react';

const App = () => {
  // State management
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Styles object
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '30px',
    },
    doctorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
    },
    doctorCard: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    },
    doctorName: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#3498db',
    },
    doctorSpecialty: {
      color: '#7f8c8d',
      fontStyle: 'italic',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.5rem',
      margin: '50px 0',
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      fontSize: '1.2rem',
      margin: '50px 0',
    },
  };

  // Data fetching
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3004/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors data');
        }
        const data = await response.json();
        setDoctors(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Rendering logic
  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <>
          <h1 style={styles.header}>Doctor-in-House Board</h1>
          <div style={styles.doctorGrid}>
            {doctors.map((doctor) => (
              <div key={doctor.id} style={styles.doctorCard}>
                <div style={styles.doctorName}>{doctor.name}</div>
                <div style={styles.doctorSpecialty}>{doctor.specialty}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
