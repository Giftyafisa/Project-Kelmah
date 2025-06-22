import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDashboardData } from '../../services/dashboardSlice';
import PropTypes from 'prop-types';
import { Box, Grid, Grow } from '@mui/material';
import StatisticsCard from '../common/StatisticsCard';
import QuickActions from '../common/QuickActions';
import Portfolio from './Portfolio';
import Credentials from './Credentials';
import AvailableJobs from './AvailableJobs';
import AvailabilityStatus from './AvailabilityStatus';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import MailIcon from '@mui/icons-material/Mail';
import EarningsChart from './EarningsChart';
import UpcomingAppointments from './UpcomingAppointments';
import ProfileCompletion from './ProfileCompletion';
import WorkerReviews from './WorkerReviews';
import NotificationsPanel from './NotificationsPanel';
import AvailabilityCalendar from '../../../worker/components/AvailabilityCalendar';

/**
 * Worker-specific dashboard displaying relevant information and actions
 */
const WorkerDashboard = ({ user = {} }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.dashboard);
  useEffect(() => { dispatch(fetchDashboardData()); }, [dispatch]);
  const metrics = data.metrics || {};
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress color="primary"/></Box>;
  }
  const statistics = [
    {
      title: 'Active Contracts',
      value: metrics.activeContracts || 0,
      color: '#FFD700',
      icon: <DescriptionIcon sx={{ fontSize: 32 }} />,
      trend: metrics.newContracts ? `+${metrics.newContracts}` : null,
      linkTo: '/worker/contracts'
    },
    {
      title: 'Pending Applications',
      value: metrics.pendingApplications || 0,
      color: '#2196F3',
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      trend: metrics.applicationsViewedDiff ? `${metrics.applicationsViewedDiff > 0 ? '-' : '+'}${Math.abs(metrics.applicationsViewedDiff)}` : null,
      linkTo: '/worker/applications'
    },
    {
      title: 'Earnings (This Month)',
      value: `$${metrics.earningsThisMonth || 0}`,
      color: '#4CAF50',
      icon: <MonetizationOnIcon sx={{ fontSize: 32 }} />,
      trend: metrics.earningsChange ? `+${metrics.earningsChange}%` : null,
      linkTo: '/worker/payment'
    },
    {
      title: 'Job Completion Rate',
      value: `${metrics.completionRate || 0}%`,
      color: '#9C27B0',
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      trend: metrics.completionRateChange ? `${metrics.completionRateChange}%` : null
    },
    {
      title: 'Escrow Balance',
      value: data.metrics?.escrowBalance ? `$${data.metrics.escrowBalance}` : '$0',
      color: '#FFA500',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />,
      linkTo: '/worker/wallet'
    }
  ];

  const quickActions = [
    { title: 'Find Jobs', icon: <SearchIcon sx={{ fontSize: 30 }} />, path: '/worker/find-work', color: '#2196F3' },
    { title: 'My Applications', icon: <AssignmentIcon sx={{ fontSize: 30 }} />, path: '/worker/applications', color: '#4CAF50', badgeContent: 2 },
    { title: 'Messages', icon: <MailIcon sx={{ fontSize: 30 }} />, path: '/messages', color: '#FF9800', badgeContent: 5 },
    { title: 'My Contracts', icon: <GavelIcon sx={{ fontSize: 30 }} />, path: '/worker/contracts', color: '#9C27B0' },
  ];

  const mockProjects = [
    { title: 'Modern Kitchen Remodel', description: 'Complete overhaul of a kitchen with custom cabinets and granite countertops.', imageUrl: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { title: 'Luxury Bathroom Tiling', description: 'New tile installation for a spa-like bathroom, featuring a walk-in shower.', imageUrl: 'https://images.pexels.com/photos/3288102/pexels-photo-3288102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ];

  const mockCerts = [
    { name: 'Master Plumber', issuer: 'State Board', expiry: '12/2025' },
    { name: 'Certified Electrician', issuer: 'National Electrical Board', expiry: '06/2026' },
  ];

  const mockSkills = [
    { name: 'Carpentry', verified: true },
    { name: 'Plumbing', verified: true },
    { name: 'Electrical', verified: false },
  ];

  const mockReviews = [
    { id: 1, reviewer: 'John Doe', rating: 5, comment: 'Great work, very professional!', date: '2025-06-10' },
    { id: 2, reviewer: 'Jane Smith', rating: 4, comment: 'Good job, timely and precise.', date: '2025-06-05' },
  ];

  const mockNotifications = [
    { id: 1, message: 'New message from Alice', time: '5 min ago' },
    { id: 2, message: 'Your application was viewed', time: '2 hours ago' },
    { id: 3, message: 'Contract approved with Bob', time: 'Yesterday' },
  ];

  const MainContent = () => (
    <Grid item lg={8} md={7} xs={12} container spacing={3} alignContent="flex-start">
      <Grid item xs={12}>
        <AvailableJobs />
      </Grid>
      <Grid item xs={12}>
        <EarningsChart />
      </Grid>
      <Grid item xs={12}>
        <Portfolio projects={mockProjects} />
      </Grid>
      <Grid item xs={12}>
        <WorkerReviews reviews={mockReviews} />
      </Grid>
      <Grid item xs={12}>
        <NotificationsPanel notifications={mockNotifications} />
      </Grid>
      <Grid item xs={12}>
        <AvailabilityCalendar />
      </Grid>
    </Grid>
  );

  const RightSidebar = () => (
    <Grid item lg={4} md={5} xs={12} container spacing={3} alignContent="flex-start">
        <Grid item xs={12}>
            <AvailabilityStatus />
        </Grid>
        <Grid item xs={12}>
          <ProfileCompletion />
        </Grid>
        <Grid item xs={12}>
          <UpcomingAppointments />
        </Grid>
        <Grid item xs={12}>
          <QuickActions actions={quickActions} />
        </Grid>
        <Grid item xs={12}>
          <Credentials skills={mockSkills} licenses={mockCerts} />
        </Grid>
    </Grid>
  );

  return (
    <Grow in timeout={500}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {statistics.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatisticsCard {...stat} />
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={4}>
          <MainContent />
          <RightSidebar />
        </Grid>
      </Box>
    </Grow>
  );
};

WorkerDashboard.propTypes = {
  user: PropTypes.object,
};

export default WorkerDashboard; 

