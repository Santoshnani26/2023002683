import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AllNotifications />} />
      <Route path="/priority" element={<PriorityInbox />} />
    </Routes>
  );
}

export default App;
