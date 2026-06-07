import { Box, Typography, Skeleton } from '@mui/material';
import NotificationCard from './NotificationCard';

const NotificationList = ({ notifications, loading }) => {
  if (loading) {
    return (
      <Box sx={{ mt: 2 }}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton 
            key={item} 
            variant="rectangular" 
            height={100} 
            sx={{ mb: 2, borderRadius: 2 }} 
            animation="wave"
          />
        ))}
      </Box>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Box 
        sx={{ 
          mt: 4, 
          p: 4, 
          textAlign: 'center', 
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed rgba(255,255,255,0.2)'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No notifications found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You're all caught up!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {notifications.map((notification, index) => (
        <NotificationCard 
          key={notification.id || index} 
          notification={notification} 
          index={index}
        />
      ))}
    </Box>
  );
};

export default NotificationList;
