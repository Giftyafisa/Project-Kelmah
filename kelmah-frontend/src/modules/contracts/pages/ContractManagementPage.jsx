import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Grid,
  Alert,
  Skeleton,
  alpha,
} from '@mui/material';
import { Add as AddIcon, ReceiptLong as ReceiptIcon } from '@mui/icons-material';
import { useContracts } from '../contexts/ContractContext';
import { Link } from 'react-router-dom';
import ContractCard from '../components/common/ContractCard';

const ContractManagementPage = () => {
  const { contracts, loading, error } = useContracts();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredContracts = useMemo(() => {
    if (loading) return [];
    const statusMap = ['all', 'active', 'pending', 'completed', 'dispute'];
    const selectedStatus = statusMap[tabValue];
    if (selectedStatus === 'all') return contracts;
    return contracts.filter(contract => contract.status === selectedStatus);
  }, [contracts, tabValue, loading]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: 'background.default', color: 'text.primary' }} role="main" aria-labelledby="contracts-header">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ fontSize: 36, mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold" id="contracts-header">
            Contract Management
          </Typography>
        </Box>
        <Button 
          component={Link}
          to="/contracts/create"
          startIcon={<AddIcon />}
          variant="contained" 
          sx={{ fontWeight: 'bold' }}
          aria-label="Create new contract"
        >
          New Contract
        </Button>
      </Box>

      <Paper 
        elevation={2}
        sx={{ 
          mb: 4, 
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Contract status tabs"
          sx={{
            "& .MuiTab-root": {
              fontWeight: '600',
            }
          }}
        >
          <Tab label={`All (${contracts.length})`} id="contract-tab-0" aria-controls="contract-panel-0" />
          <Tab label={`Active (${contracts.filter(c => c.status === 'active').length})`} id="contract-tab-1" aria-controls="contract-panel-1" />
          <Tab label={`Pending (${contracts.filter(c => c.status === 'pending').length})`} id="contract-tab-2" aria-controls="contract-panel-2" />
          <Tab label={`Completed (${contracts.filter(c => c.status === 'completed').length})`} id="contract-tab-3" aria-controls="contract-panel-3" />
          <Tab label={`Disputes (${contracts.filter(c => c.status === 'dispute').length})`} id="contract-tab-4" aria-controls="contract-panel-4" />
        </Tabs>
      </Paper>

      {loading ? (
        <Grid container spacing={3} role="status" aria-live="polite">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} aria-label="Loading contract placeholder" />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert severity="error" role="alert" sx={{ mt: 3 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3} component="ul" role="list" sx={{ p: 0, m: 0, listStyle: 'none' }}>
          {filteredContracts.length > 0 ? (
            filteredContracts.map(contract => (
              <Grid item key={contract.id} xs={12} sm={6} md={4} lg={3} component="li" role="listitem">
                <ContractCard contract={contract} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', p: 5, mt: 4, bgcolor: 'background.paper', borderRadius: 2 }} role="alert">
                <ReceiptIcon sx={{ fontSize: 48, mb: 1 }} aria-hidden="true"/>
                <Typography variant="h6" color="text.secondary">
                  No contracts found in this category.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ContractManagementPage; 
