import { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Alert, Paper, Divider } from '@mui/material';
import NotificationList from '../components/NotificationList';
import PaginationControls from '../components/PaginationControls';
import { notificationApi } from '../api/notificationApi';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const PriorityInbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  });

  const fetchPriorityData = async (page, limit) => {
    setLoading(true);
    try {
      const response = await notificationApi.getPriorityNotifications(page, limit);
      if (response.success) {
        setNotifications(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch priority notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorityData(pagination.currentPage, pagination.itemsPerPage);
  }, [pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (page) => {
    setPagination(p => ({ ...p, currentPage: page }));
  };

  const handleLimitChange = (limit) => {
    setPagination(p => ({ ...p, itemsPerPage: limit, currentPage: 1 }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <WhatshotIcon color="error" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Priority Inbox
        </Typography>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Smart sorted by Placement &gt; Result &gt; Event, then recency.
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          bgcolor: 'background.default', 
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 3
        }}
      >
        <NotificationList 
          notifications={notifications} 
          loading={loading} 
        />
        
        {!loading && (
          <PaginationControls 
            pagination={pagination} 
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </Paper>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PriorityInbox;
