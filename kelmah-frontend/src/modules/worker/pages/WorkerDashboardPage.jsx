import React from 'react';
import { Box, Grid, Typography, CircularProgress, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import WorkerDashboard from '../../dashboard/components/worker/WorkerDashboard';
import workerImage from '../../../assets/cartoon-worker.jpeg';

const WorkerDashboardPage = () => {
  const theme = useTheme();
  const user = useSelector(state => state.auth.user);
  const defaultUser = { 
    firstName: 'Demo', 
    role: 'worker',
    profession: 'Professional Carpenter' 
  };
  
  // Use either the Redux user or a default user if null
  const displayUser = user || defaultUser;
  
  // Get user's professional title
  const getProfessionalTitle = () => {
    if (displayUser?.profession) return displayUser.profession;
    if (displayUser?.role === 'worker') return 'Professional Carpenter';
    return '';
  };
  
  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      px: { xs: 2, sm: 3, md: 4 },
      py: 4
    }}>
      <Box sx={{ mb: 6, borderBottom: '2px solid #D4AF37', pb: 3, color: '#fff' }}>
        <Typography variant="h2" fontWeight={800} sx={{ mb: 1, letterSpacing: 0.5, fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#D4AF37' }}>
          Welcome back, {displayUser?.firstName || displayUser?.name || 'Demo'}!
        </Typography>
        <Typography variant="h5" fontWeight={500} sx={{ mb: 2, opacity: 0.9, fontSize: '1.25rem', color: '#fff' }}>
          {getProfessionalTitle()}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1rem', color: '#ddd' }}>
          Ready to find your next job? Let's get to work.
        </Typography>
      </Box>
      <WorkerDashboard user={displayUser} />
    </Box>
  );
};

export default WorkerDashboardPage; 





