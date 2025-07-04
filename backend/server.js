const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const doctorsFilePath = path.join(__dirname, 'doctors.json');

// Function to read doctors from the JSON file
const readDoctors = () => {
    const data = fs.readFileSync(doctorsFilePath);
    return JSON.parse(data);
};

// Function to write doctors to the JSON file
const writeDoctors = (doctors) => {
    fs.writeFileSync(doctorsFilePath, JSON.stringify(doctors, null, 2));
};

// Broadcast to all connected clients
const broadcast = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// WebSocket connection handler
wss.on('connection', ws => {
    // Send the initial list of doctors to the newly connected client
    ws.send(JSON.stringify({ type: 'initial', doctors: readDoctors() }));
});

// API endpoints for the admin panel
app.get('/api/doctors', (req, res) => {
    res.json(readDoctors());
});

// This is the new POST endpoint
app.post('/api/doctors', (req, res) => {
    const doctors = readDoctors();
    const newDoctor = {
        id: Date.now(), // Simple unique ID
        name: req.body.name,
        specialty: req.body.specialty,
        status: 'Available' // Default status
    };
    doctors.push(newDoctor);
    writeDoctors(doctors);
    broadcast({ type: 'update', doctors });
    res.status(201).json(newDoctor);
});

app.put('/api/doctors/:id', (req, res) => {
    const doctors = readDoctors();
    const doctorIndex = doctors.findIndex(d => d.id == req.params.id);
    if (doctorIndex > -1) {
        // Update all fields that are provided in the request body
        doctors[doctorIndex] = {
            ...doctors[doctorIndex],
            ...req.body
        };
        writeDoctors(doctors);
        broadcast({ type: 'update', doctors });
        res.json(doctors[doctorIndex]);
    } else {
        res.status(404).send('Doctor not found');
    }
});

// This is the new DELETE endpoint
app.delete('/api/doctors/:id', (req, res) => {
    let doctors = readDoctors();
    const initialLength = doctors.length;
    doctors = doctors.filter(d => d.id != req.params.id);
    if (doctors.length < initialLength) {
        writeDoctors(doctors);
        broadcast({ type: 'update', doctors });
        res.status(204).send();
    } else {
        res.status(404).send('Doctor not found');
    }
});

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
