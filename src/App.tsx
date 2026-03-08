import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainWebsite from './MainWebsite'; 
import { AdminDashboard } from './component/AdminDashboard';
import { VerifyTicket } from './component/VerifyTicket';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website */}
        <Route path="/" element={<MainWebsite />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Ticket Verification System */}
        <Route path="/verify/:ticketId" element={<VerifyTicket />} />
      </Routes>
    </Router>
  );
}

export default App;