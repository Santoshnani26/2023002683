import { ToggleButton, ToggleButtonGroup, Badge, Box } from '@mui/material';

const FilterBar = ({ currentFilter, onFilterChange, counts }) => {
  
  const handleFormat = (event, newFormat) => {
    if (newFormat !== null) {
      onFilterChange(newFormat);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 2 }}>
      <ToggleButtonGroup
        value={currentFilter}
        exclusive
        onChange={handleFormat}
        aria-label="notification type"
        sx={{
          backgroundColor: 'background.paper',
          '& .MuiToggleButton-root': {
            px: 3,
            py: 1,
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
              backgroundColor: 'rgba(126, 87, 194, 0.1)',
            }
          }
        }}
      >
        <ToggleButton value="all" aria-label="all notifications">
          <Badge badgeContent={counts?.total || 0} color="primary" sx={{ '& .MuiBadge-badge': { right: -15, top: 0 } }}>
            All
          </Badge>
        </ToggleButton>
        <ToggleButton value="placement" aria-label="placement notifications">
          <Badge badgeContent={counts?.placement || 0} sx={{ '& .MuiBadge-badge': { right: -15, top: 0, backgroundColor: '#4caf50', color: 'white' } }}>
            Placement
          </Badge>
        </ToggleButton>
        <ToggleButton value="result" aria-label="result notifications">
          <Badge badgeContent={counts?.result || 0} sx={{ '& .MuiBadge-badge': { right: -15, top: 0, backgroundColor: '#2196f3', color: 'white' } }}>
            Result
          </Badge>
        </ToggleButton>
        <ToggleButton value="event" aria-label="event notifications">
          <Badge badgeContent={counts?.event || 0} sx={{ '& .MuiBadge-badge': { right: -15, top: 0, backgroundColor: '#ff9800', color: 'white' } }}>
            Event
          </Badge>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default FilterBar;
