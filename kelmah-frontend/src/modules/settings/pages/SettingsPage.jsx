import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import NotificationSettings from '../components/common/NotificationSettings';
import AccountSettings from '../components/common/AccountSettings';
import SecuritySettings from '../components/common/SecuritySettings';
import { useSettings } from '../hooks/useSettings';

const SettingsPage = () => {
  const { settings, loading, error, updateNotificationPreferences } = useSettings();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const settingsPanels = [
    { component: <NotificationSettings settings={settings} loading={loading} error={error} updateNotificationPreferences={updateNotificationPreferences} />, label: 'Notifications', icon: <NotificationsIcon /> },
    { component: <AccountSettings />, label: 'Account', icon: <AccountCircleIcon /> },
    { component: <SecuritySettings />, label: 'Security & Password', icon: <SecurityIcon /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ fontSize: 36, mr: 1.5, color: '#D4AF37' }} />
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#D4AF37', fontSize: '2rem' }}>
          Settings
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
           <Paper 
                elevation={3}
                sx={{ 
                    p: 2,
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #D4AF37',
                    borderRadius: 2
                }}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="Vertical settings tabs"
                    sx={{
                        borderRight: '2px solid #D4AF37',
                        color: '#fff',
                        "& .MuiTab-root": {
                            justifyContent: 'flex-start',
                            fontWeight: 600,
                            textTransform: 'none',
                            color: '#fff',
                            fontSize: '1rem'
                        },
                         "& .Mui-selected": {
                            color: '#D4AF37',
                        },
                        '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' }
                    }}
                >
                    {settingsPanels.map((panel, index) => (
                        <Tab key={panel.label} label={panel.label} icon={panel.icon} iconPosition="start" sx={{ textTransform: 'none' }} />
                    ))}
                </Tabs>
           </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
            <Box>
              {settingsPanels[tabValue].component}
            </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage; 