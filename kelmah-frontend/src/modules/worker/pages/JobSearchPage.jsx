import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const JobSearchPage = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" color="text.secondary">
        Job Search functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default JobSearchPage; 