import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';

const NotificationCard = ({ notification, index }) => {
  const theme = useTheme();
  
  const getTypeConfig = (type) => {
    const t = type?.toLowerCase() || 'event';
    switch(t) {
      case 'placement':
        return { color: theme.palette.notification.placement, icon: <CheckCircleIcon fontSize="small" />, label: 'Placement' };
      case 'result':
        return { color: theme.palette.notification.result, icon: <InfoIcon fontSize="small" />, label: 'Result' };
      case 'event':
        return { color: theme.palette.notification.event, icon: <EventIcon fontSize="small" />, label: 'Event' };
      default:
        return { color: theme.palette.grey[500], icon: <InfoIcon fontSize="small" />, label: type };
    }
  };

  const config = getTypeConfig(notification.type);
  const date = new Date(notification.timestamp || notification.createdAt || notification.date || Date.now());
  const timeString = date.toLocaleString();

  return (
    <Card 
      className="fade-in glass-panel" 
      sx={{ 
        mb: 2, 
        borderLeft: `4px solid ${config.color}`,
        animationDelay: `${index * 0.05}s`
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: '500' }}>
            {notification.title || notification.message || 'Notification'}
          </Typography>
          <Chip 
            icon={config.icon} 
            label={config.label} 
            size="small" 
            sx={{ 
              backgroundColor: `${config.color}20`, 
              color: config.color,
              fontWeight: 'bold',
              borderColor: config.color,
              border: '1px solid'
            }} 
          />
        </Box>
        
        {notification.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {notification.description}
          </Typography>
        )}
        
        <Typography variant="caption" color="text.secondary">
          {timeString}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
