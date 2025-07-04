import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Modal } from "react-bootstrap";

const AdminPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);

  // Fetch doctors on mount
  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors:", err);
        setLoading(false);
      });
  }, []);

  // Function to open the edit modal
  const handleEditClick = (doctor) => {
    setCurrentDoctor(doctor);
    setShowEditModal(true);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentDoctor(null);
  };

  // Handle saving edited doctor data
  const handleSaveEdit = async () => {
    if (!currentDoctor.name.trim() || !currentDoctor.specialty.trim()) {
      alert("Please enter both Name and Specialty.");
      return;
    }

    try {
      const response = await fetch(`/api/doctors/${currentDoctor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentDoctor),
      });

      if (!response.ok) {
        throw new Error(`Failed to update doctor: ${response.statusText}`);
      }

      // Update the doctors list with the edited doctor
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === currentDoctor.id ? currentDoctor : doc))
      );
      handleCloseEditModal(); // Close modal on success
    } catch (error) {
      console.error(error);
      alert("Error updating doctor. Please try again.");
    }
  };

  // Handle form submission to add a new doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim()) {
      alert("Please enter both Name and Specialty.");
      return;
    }

    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          specialty: specialty.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add doctor: ${response.statusText}`);
      }

      const newDoctor = await response.json();
      // Add new doctor to state to update UI immediately
      setDoctors((prev) => [...prev, newDoctor]);
      // Clear form fields
      setName("");
      setSpecialty("");
    } catch (error) {
      console.error(error);
      alert("Error adding doctor. Please try again.");
    }
  };

  // Handle doctor deletion
  const handleDeleteDoctor = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        // Remove doctor from state to update UI immediately
        setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        throw new Error(`Failed to delete doctor: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting doctor. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Admin Panel - Doctors</h2>
      {/* Add Doctor Form */}
      <Form onSubmit={handleAddDoctor} className="mb-4">
        <Row className="align-items-end">
          <Col md="4">
            <Form.Group controlId="formDoctorName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter doctor's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md="4">
            <Form.Group controlId="formDoctorSpecialty">
              <Form.Label>Specialty</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md="2">
            <Button variant="primary" type="submit" className="w-100">
              Add Doctor
            </Button>
          </Col>
        </Row>
      </Form>
      {/* Doctors Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Status</th>
            <th>Actions</th>{/* New Actions column */}
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No doctors found.
              </td>
            </tr>
          ) : (
            doctors.map(({ id, name, specialty, status }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{specialty}</td>
                <td>{status}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick({ id, name, specialty, status })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteDoctor(id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentDoctor && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentDoctor.name}
                  onChange={(e) =>
                    setCurrentDoctor({ ...currentDoctor, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  type="text"
                  value={currentDoctor.specialty}
                  onChange={(e) =>
                    setCurrentDoctor({ ...currentDoctor, specialty: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={currentDoctor.status}
                  onChange={(e) =>
                    setCurrentDoctor({ ...currentDoctor, status: e.target.value })
                  }
                >
                  <option>Available</option>
                  <option>In-Consultation</option>
                  <option>On-Break</option>
                  <option>Off-Duty</option>
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;