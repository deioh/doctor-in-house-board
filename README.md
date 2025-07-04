# Doctor-In-House Board

This project is a real-time, responsive in-house status board for medical staff. It features a main display view suitable for large screens and a separate admin panel for managing doctor information and statuses.

## Tech Stack

- **Backend:** Node.js, Express, WebSockets
- **Frontend:** React, Vite, React Router
- **Data:** JSON file (simple database)

## How to Run

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies (if you haven't already):
    ```bash
    npm install
    ```
3.  Start the backend server:
    ```bash
    npm start
    ```
    The backend server will run on `http://localhost:3004`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies (if you haven't already):
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173` (check your terminal for the exact URL).

### Accessing the Application

-   **Main Display:** Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
-   **Admin Panel:** If routed, navigate to the admin panel URL (e.g., `http://localhost:5173/admin`).