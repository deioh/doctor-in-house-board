import React, { useState } from 'react';

const AdminPanel = ({ doctors, setDoctors }) => {
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        const newDoctor = { name, specialty, location, status: 'Out of Office' };
        const response = await fetch('http://localhost:3002/api/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDoctor),
        });
        const addedDoctor = await response.json();
        setDoctors([...doctors, addedDoctor]);
        setName('');
        setSpecialty('');
        setLocation('');
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const statuses = ['Available', 'On Call', 'On Vacation'];
        const currentIndex = statuses.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];

        // Optimistically update the UI
        setDoctors(doctors.map(doc =>
            doc.id === id ? { ...doc, status: newStatus } : doc
        ));

        // Send the update to the backend
        try {
            await fetch(`http://localhost:3001/api/doctors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            // If the API call fails, revert the change
            console.error("Failed to update status:", error);
            setDoctors(doctors.map(doc =>
                doc.id === id ? { ...doc, status: currentStatus } : doc
            ));
        }
    };

    const handleDelete = async (id) => {
        const originalDoctors = [...doctors];
        // Optimistically update the UI
        setDoctors(doctors.filter(doc => doc.id !== id));

        try {
            await fetch(`http://localhost:3001/api/doctors/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            // If the API call fails, revert the change
            console.error("Failed to delete doctor:", error);
            setDoctors(originalDoctors);
        }
    };

    return (
        <div className="container">
            <h2>Admin Panel</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Add New Doctor</h5>
                    <form onSubmit={handleAddDoctor}>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Doctor</button>
                    </form>
                </div>
            </div>

            <h3>Manage Doctors</h3>
            <ul className="list-group">
                {doctors.map(doctor => (
                    <li key={doctor.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{doctor.name}</strong> ({doctor.specialty}) - {doctor.location}
                        </div>
                        <div>
                            <button
                                className={`btn btn-sm ${doctor.status === 'In-House' ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => handleToggleStatus(doctor.id, doctor.status)}
                            >
                                {doctor.status}
                            </button>
                            <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(doctor.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
