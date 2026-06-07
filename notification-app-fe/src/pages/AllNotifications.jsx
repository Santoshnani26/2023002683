import { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import FilterBar from '../components/FilterBar';
import NotificationList from '../components/NotificationList';
import PaginationControls from '../components/PaginationControls';
import { notificationApi } from '../api/notificationApi';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  });

  const fetchData = async (currentFilter, page, limit) => {
    setLoading(true);
    try {
      // Also fetch counts
      const countsData = await notificationApi.getCounts();
      if (countsData.success) {
        setCounts(countsData.counts);
      }

      const response = await notificationApi.getNotifications(
        currentFilter === 'all' ? null : currentFilter,
        page,
        limit
      );
      
      if (response.success) {
        setNotifications(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter, pagination.currentPage, pagination.itemsPerPage);
  }, [filter, pagination.currentPage, pagination.itemsPerPage]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(p => ({ ...p, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(p => ({ ...p, currentPage: page }));
  };

  const handleLimitChange = (limit) => {
    setPagination(p => ({ ...p, itemsPerPage: limit, currentPage: 1 }));
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Notifications
      </Typography>
      
      <FilterBar 
        currentFilter={filter} 
        onFilterChange={handleFilterChange} 
        counts={counts}
      />
      
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

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllNotifications;
