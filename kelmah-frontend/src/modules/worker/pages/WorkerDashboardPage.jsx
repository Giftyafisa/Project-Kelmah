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
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, background: '#121212', color: '#FFFFFF', minHeight: 'calc(100vh - 64px)' /* Adjust 64px based on actual header height */ }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          pb: 2,
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)', // Gold border
        }}
      >
        <Box
          component="img"
          src={displayUser?.profilePictureUrl || workerImage} // Use actual profile pic or fallback
          alt={`${displayUser?.firstName || 'Worker'}'s Avatar`}
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            mr: 2,
            border: '2px solid #D4AF37' // Gold border for avatar
          }}
        />
        <Box>
          <Typography
            variant="h3"
            fontWeight={700} // Slightly reduced weight for modern look
            sx={{
              mb: 0.5, // Reduced margin
              letterSpacing: 0.5,
              color: '#D4AF37', // Gold color for welcome
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } // Responsive font size
            }}
          >
            Welcome back, {displayUser?.firstName || displayUser?.name || 'Demo'}!
          </Typography>
          <Typography
            variant="h6" // Upgraded for better hierarchy
            fontWeight={500}
            sx={{
              mb: 1, // Reduced margin
              opacity: 0.9,
              color: '#E0E0E0', // Light grey for profession
            }}
          >
            {getProfessionalTitle()}
          </Typography>
          <Typography
            variant="body1" // More appropriate for a subtitle
            sx={{
              opacity: 0.8,
              color: '#B0B0B0' // Softer grey
            }}
          >
            Ready to find your next job? Let's get to work.
          </Typography>
        </Box>
      </Box>
      <WorkerDashboard user={displayUser} />
    </Box>
  );
};

export default WorkerDashboardPage; 





