import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Tabs, 
  Tab, 
  Box 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentTab = location.pathname === '/priority' ? 1 : 0;

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) navigate('/');
    if (newValue === 1) navigate('/priority');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0} className="glass-panel">
        <Toolbar>
          <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Affordmed Notifications
          </Typography>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
          >
            <Tab label="All Notifications" />
            <Tab label="Priority Inbox" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
