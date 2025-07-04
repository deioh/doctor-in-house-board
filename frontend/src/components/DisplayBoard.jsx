import React from 'react';
import DoctorCard from './DoctorCard';
import './DisplayBoard.css';

const DisplayBoard = ({ doctors }) => {
    const onCallDoctors = doctors.filter(d => d.status === 'On Call');
    const onVacationDoctors = doctors.filter(d => d.status === 'On Vacation');
    const availableDoctors = doctors.filter(d => d.status === 'Available');

    return (
        <div className="display-board">
            <div className="calendar-view">
                <div className="calendar-column available">
                    <h2>Available</h2>
                    <div className="cards-container">
                        {availableDoctors.map(doctor => (
                            <DoctorCard doctor={doctor} key={doctor.id} />
                        ))}
                    </div>
                </div>
                <div className="calendar-column on-call">
                    <h2>On Call</h2>
                    <div className="cards-container">
                        {onCallDoctors.map(doctor => (
                            <DoctorCard doctor={doctor} key={doctor.id} />
                        ))}
                    </div>
                </div>
                <div className="calendar-column on-vacation">
                    <h2>On Vacation</h2>
                    <div className="cards-container">
                        {onVacationDoctors.map(doctor => (
                            <DoctorCard doctor={doctor} key={doctor.id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayBoard;
