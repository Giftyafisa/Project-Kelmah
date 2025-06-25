import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Tabs, Tab, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Button } from '@mui/material';
import { WorkOutline as AllIcon, AccessTime as PendingIcon, CheckCircle as AcceptedIcon, Cancel as RejectedIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkerApplications, selectWorkerApplications, selectWorkerLoading, selectWorkerError } from '../services/workerSlice';
import { Link as RouterLink } from 'react-router-dom';

const MyApplicationsPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectWorkerLoading('applications'));
  const error = useSelector(selectWorkerError('applications'));
  const pending = useSelector(selectWorkerApplications('pending'));
  const accepted = useSelector(selectWorkerApplications('accepted'));
  const rejected = useSelector(selectWorkerApplications('rejected'));
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchWorkerApplications('pending'));
    dispatch(fetchWorkerApplications('accepted'));
    dispatch(fetchWorkerApplications('rejected'));
  }, [dispatch]);

  const handleTabChange = (e, newVal) => setTabValue(newVal);

  let applications;
  switch(tabValue) {
    case 1: applications = pending; break;
    case 2: applications = accepted; break;
    case 3: applications = rejected; break;
    default: applications = [...pending, ...accepted, ...rejected];
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Applications</Typography>
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<AllIcon />} iconPosition="start" label={`All (${applications.length})`} />
          <Tab icon={<PendingIcon />} iconPosition="start" label={`Pending (${pending.length})`} />
          <Tab icon={<AcceptedIcon />} iconPosition="start" label={`Accepted (${accepted.length})`} />
          <Tab icon={<RejectedIcon />} iconPosition="start" label={`Rejected (${rejected.length})`} />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : applications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>No applications found.</Typography>
          <Button component={RouterLink} to="/worker/find-work" variant="contained" sx={{ mt: 2 }}>
            Find Work
          </Button>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map(app => (
                <TableRow key={app.id || app._id}>
                  <TableCell>{app.job?.title || 'N/A'}</TableCell>
                  <TableCell>{app.status}</TableCell>
                  <TableCell align="right">
                    <Button size="small" component={RouterLink} to={`/worker/applications/${app.id || app._id}`}>Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyApplicationsPage; 

