import { Routes, Route } from 'react-router-dom';
import DoctorBoard from './DoctorBoard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DoctorBoard />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
};

export default App;
