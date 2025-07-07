import React, { useState, useEffect } from 'react';
import {
    Container,
  Typography, 
    Paper,
    Tabs,
    Tab,
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button, 
  IconButton,
  CircularProgress,
    Card,
    CardContent,
  Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
  DialogActions,
  TextField,
  Grid,
  Stack
} from '@mui/material';
import {
  Visibility as VisibilityIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  WorkOutline as WorkOutlineIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import applicationsApi from '../services/applicationsApi';
import { useTheme } from '@mui/material/styles';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
    const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  const theme = useTheme();

  // Load applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationsApi.getMyApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Open application details dialog
  const handleOpenDetails = (application) => {
    setSelectedApplication(application);
    setOpenDetailsDialog(true);
  };
  
  // Open message dialog
  const handleOpenMessage = (application) => {
        setSelectedApplication(application);
    setOpenMessageDialog(true);
  };
  
  // Send message
  const handleSendMessage = () => {
    console.log('Sending message to', selectedApplication?.company, ':', message);
    setMessage('');
    setOpenMessageDialog(false);
    // Here you would typically call an API to send the message
  };
  
  // Filter applications based on current tab
  const filteredApplications = applications.filter(app => {
    if (tabValue === 0) return true; // All applications
    if (tabValue === 1) return app.status === 'pending';
    if (tabValue === 2) return app.status === 'interview';
    if (tabValue === 3) return app.status === 'offer';
    if (tabValue === 4) return app.status === 'rejected';
    return false;
  });
  
  // Status label and color mapping for dark theme
  const getStatusInfo = (status) => {
    const commonChipStyles = {
      color: '#000000', // Black text for better contrast on gold/light backgrounds
      fontWeight: 'medium',
    };
    const iconStyles = { fontSize: '1rem', color: '#000000' };

    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          chipProps: { sx: { ...commonChipStyles, backgroundColor: '#D4AF37' } }, // Gold
          icon: <AccessTimeIcon sx={iconStyles} />
        };
      case 'interview':
        return {
          label: 'Interview',
          chipProps: { sx: { ...commonChipStyles, backgroundColor: '#64B5F6', color: '#FFFFFF' } }, // Light Blue (adjust if needed)
          icon: <PersonIcon sx={{...iconStyles, color: '#FFFFFF'}} />
        };
      case 'offer':
        return {
          label: 'Offer Received',
          chipProps: { sx: { ...commonChipStyles, backgroundColor: '#81C784' } }, // Light Green
          icon: <CheckCircleIcon sx={iconStyles} />
        };
      case 'rejected':
        return {
          label: 'Rejected',
          chipProps: { sx: { ...commonChipStyles, backgroundColor: '#E57373' } }, // Light Red
          icon: <CancelIcon sx={iconStyles} />
        };
      default:
        return {
          label: 'Unknown',
          chipProps: { sx: { ...commonChipStyles, backgroundColor: '#9E9E9E', color: '#FFFFFF' } }, // Grey
          icon: <AccessTimeIcon sx={{...iconStyles, color: '#FFFFFF'}} />
        };
    }
  };

  const commonTextFieldStyles = {
    '& label.Mui-focused': { color: '#D4AF37' },
    '& .MuiInput-underline:after': { borderBottomColor: '#D4AF37' },
    '& .MuiOutlinedInput-root': {
      color: '#FFFFFF',
      '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
      '&:hover fieldset': { borderColor: '#D4AF37' },
      '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
    },
    '& .MuiInputLabel-root': { color: '#B0B0B0' },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
  };

    return (
    <Container sx={{ py: 4, background: '#121212', color: '#FFFFFF', minHeight: 'calc(100vh - 64px)' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold', mb:3 }}>My Applications</Typography>
      
      <Paper sx={{ width: '100%', mb: 4, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
        <Tabs
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' },
            '& .MuiTab-root': {
              color: '#B0B0B0',
              '&.Mui-selected': { color: '#D4AF37', fontWeight: 'bold' },
            },
            '& .MuiTabs-scrollButtons': { color: '#D4AF37' }
          }}
        >
          <Tab label="All Applications" />
          <Tab label="Pending" />
          <Tab label="Interviews" />
          <Tab label="Offers" />
          <Tab label="Rejected" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{color: '#D4AF37'}}/>
          </Box>
        ) : filteredApplications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <WorkOutlineIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{color: '#E0E0E0'}}>
              No applications found
            </Typography>
            <Typography sx={{color: '#B0B0B0'}} paragraph>
              You haven't applied to any jobs in this category yet.
            </Typography>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#D4AF37',
                    color: '#000000',
                    '&:hover': { backgroundColor: '#BF953F' }
                }}
                component="a"
                href="/worker/find-work" // Assuming this is the correct path
            >
              Browse Jobs
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ '& .MuiTableCell-head': { color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.3)' }, '& .MuiTableCell-body': { color: '#E0E0E0', borderBottom: '1px solid rgba(212,175,55,0.2)'} }}>
              <TableHead>
                <TableRow>
                  <TableCell>Job</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => {
                  const statusInfo = getStatusInfo(application.status);
                  
                  return (
                    <TableRow key={application.id} sx={{ '&:hover': { backgroundColor: 'rgba(212,175,55,0.05)' } }}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{color: '#FFFFFF'}}>{application.job.title}</Typography>
                        <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                          {application.job.location.city}, {application.job.location.country}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={application.companyLogo} 
                            alt={application.company}
                            variant="rounded" // Changed to rounded for consistency
                            sx={{ width: 30, height: 30, mr: 1, border: '1px solid #D4AF37', backgroundColor: 'rgba(212,175,55,0.2)' }}
                          />
                          <Typography variant="body2" sx={{color: '#E0E0E0'}}>{application.company}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={statusInfo.icon}
                          label={statusInfo.label}
                          size="small"
                          {...statusInfo.chipProps}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDetails(application)}
                          title="View Details"
                          sx={{color: '#D4AF37'}}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenMessage(application)}
                          title="Send Message"
                          sx={{color: '#D4AF37'}}
                        >
                          <MessageIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Application Details Dialog */}
      <Dialog 
        open={openDetailsDialog} 
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2 } }}
      >
        {selectedApplication && (
          <>
            <DialogTitle sx={{ color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
              Application Details
            </DialogTitle>
            <DialogContent sx={{pt: '20px !important'}}>
              <Card variant="outlined" sx={{ mb: 3, backgroundColor: '#2C2C2C', borderColor: 'rgba(212,175,55,0.3)' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{color: '#D4AF37'}}>{selectedApplication.jobTitle}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: '#B0B0B0' }} />
                      <Typography variant="body2" sx={{color: '#E0E0E0'}}>{selectedApplication.company}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WorkOutlineIcon fontSize="small" sx={{ mr: 0.5, color: '#B0B0B0' }} />
                      <Typography variant="body2" sx={{color: '#E0E0E0'}}>{selectedApplication.salary || 'Not Disclosed'}</Typography>
                    </Box>
                  </Stack>
                  
                  <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.2)' }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{color: '#B0B0B0'}}>Application Status</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip
                          icon={getStatusInfo(selectedApplication.status).icon}
                          label={getStatusInfo(selectedApplication.status).label}
                          size="small"
                           {...getStatusInfo(selectedApplication.status).chipProps}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{color: '#B0B0B0'}}>Applied On</Typography>
                      <Typography variant="body1" sx={{color: '#E0E0E0'}}>
                        {new Date(selectedApplication.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    {selectedApplication.interviewDate && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{color: '#B0B0B0'}}>Interview Date</Typography>
                        <Typography variant="body1" sx={{color: '#E0E0E0'}}>
                          {new Date(selectedApplication.interviewDate).toLocaleDateString()}
                        </Typography>
                        </Grid>
                    )}
                </Grid>
                </CardContent>
              </Card>
              
              {selectedApplication.status === 'offer' && (
                <Card variant="outlined" sx={{ mb: 3, backgroundColor: 'rgba(129, 199, 132, 0.1)', borderColor: '#81C784' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{color: '#81C784'}} gutterBottom>
                      <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                      Congratulations! You have received a job offer.
                    </Typography>
                    <Typography variant="body2" sx={{color: '#E0E0E0'}}>
                      Please check your messages for details about the offer. You can accept or negotiate the terms.
                    </Typography>
                  </CardContent>
                </Card>
              )}
              
              <Typography variant="subtitle1" gutterBottom sx={{color: '#D4AF37'}}>Application Timeline</Typography>
              <Box sx={{ ml: 2, borderLeft: `2px solid rgba(212,175,55,0.3)`, pl: 2 }}>
                <Box sx={{ mb: 2, position: 'relative' }}>
                  <Box sx={{ width: 10, height: 10, bgcolor: '#D4AF37', borderRadius: '50%', position: 'absolute', left: -28, top: 6 }} />
                  <Typography variant="subtitle2" sx={{color: '#FFFFFF'}}>Application Submitted</Typography>
                  <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                    {new Date(selectedApplication.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {selectedApplication.status !== 'pending' && (
                  <Box sx={{ mb: 2, position: 'relative' }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#D4AF37', borderRadius: '50%', position: 'absolute', left: -28, top: 6 }} />
                    <Typography variant="subtitle2" sx={{color: '#FFFFFF'}}>Application Reviewed</Typography>
                    <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                      {new Date(new Date(selectedApplication.createdAt).getTime() + 3*24*60*60*1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                
                {(selectedApplication.status === 'interview' || selectedApplication.status === 'offer' || selectedApplication.status === 'rejected') && selectedApplication.interviewDate && (
                  <Box sx={{ mb: 2, position: 'relative' }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#D4AF37', borderRadius: '50%', position: 'absolute', left: -28, top: 6 }} />
                    <Typography variant="subtitle2" sx={{color: '#FFFFFF'}}>Interview Scheduled</Typography>
                    <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                      {new Date(selectedApplication.interviewDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                
                {selectedApplication.status === 'offer' && (
                  <Box sx={{ mb: 2, position: 'relative' }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#81C784', borderRadius: '50%', position: 'absolute', left: -28, top: 6 }} />
                    <Typography variant="subtitle2" sx={{color: '#FFFFFF'}}>Offer Received</Typography>
                    <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                      {new Date(new Date(selectedApplication.interviewDate).getTime() + 5*24*60*60*1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                
                {selectedApplication.status === 'rejected' && (
                  <Box sx={{ mb: 2, position: 'relative' }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#E57373', borderRadius: '50%', position: 'absolute', left: -28, top: 6 }} />
                    <Typography variant="subtitle2" sx={{color: '#FFFFFF'}}>Application Rejected</Typography>
                    <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                      {new Date(new Date(selectedApplication.interviewDate).getTime() + 2*24*60*60*1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{borderTop: '1px solid rgba(212,175,55,0.3)', p:2}}>
              <Button onClick={() => setOpenDetailsDialog(false)} sx={{color: '#B0B0B0'}}>Close</Button>
              <Button 
                onClick={() => {
                  setOpenDetailsDialog(false);
                  handleOpenMessage(selectedApplication);
                }}
                variant="outlined"
                startIcon={<MessageIcon />}
                sx={{
                    color: '#D4AF37',
                    borderColor: 'rgba(212,175,55,0.5)',
                    '&:hover': {borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)'}
                }}
              >
                Contact Employer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Message Dialog */}
      <Dialog
        open={openMessageDialog} 
        onClose={() => setOpenMessageDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2 } }}
      >
        {selectedApplication && (
          <>
            <DialogTitle sx={{ color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
              Message to {selectedApplication.company}
            </DialogTitle>
            <DialogContent sx={{pt: '20px !important'}}>
              <Typography variant="subtitle2" gutterBottom sx={{color: '#E0E0E0'}}>
                Regarding: {selectedApplication.jobTitle}
              </Typography>
              <Typography variant="body2" sx={{color: '#B0B0B0'}} paragraph>
                Your message will be sent to the hiring manager at {selectedApplication.company}.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Message"
                fullWidth
                variant="outlined"
                multiline
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={commonTextFieldStyles}
                InputProps={{ sx: { color: '#FFFFFF' } }}
              />
            </DialogContent>
            <DialogActions sx={{borderTop: '1px solid rgba(212,175,55,0.3)', p:2}}>
              <Button onClick={() => setOpenMessageDialog(false)} sx={{color: '#B0B0B0'}}>Cancel</Button>
              <Button 
                onClick={handleSendMessage}
                variant="contained"
                disabled={!message.trim()}
                sx={{
                    backgroundColor: '#D4AF37',
                    color: '#000000',
                    '&:hover': { backgroundColor: '#BF953F' },
                    '&.Mui-disabled': {backgroundColor: 'rgba(212,175,55,0.5)', color: 'rgba(0,0,0,0.5)'}
                }}
              >
                Send Message
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyApplicationsPage; 

