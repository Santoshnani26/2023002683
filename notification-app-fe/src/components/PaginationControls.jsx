import { Box, Pagination, Select, MenuItem, Typography } from '@mui/material';

const PaginationControls = ({ pagination, onPageChange, onLimitChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Items per page:
        </Typography>
        <Select
          value={pagination.itemsPerPage || 10}
          onChange={(e) => onLimitChange(e.target.value)}
          size="small"
          sx={{ minWidth: 80 }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </Box>
      
      <Pagination 
        count={pagination.totalPages} 
        page={pagination.currentPage} 
        onChange={(e, page) => onPageChange(page)} 
        color="primary" 
        shape="rounded"
      />
    </Box>
  );
};

export default PaginationControls;
