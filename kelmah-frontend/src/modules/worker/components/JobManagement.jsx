import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Message as MessageIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/contexts/AuthContext';
import { format } from 'date-fns';

const JobManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    milestone: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [activeTab]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workers/${user.id}/jobs?status=${getStatusForTab(activeTab)}`);
      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusForTab = (tab) => {
    switch (tab) {
      case 0:
        return 'active';
      case 1:
        return 'completed';
      case 2:
        return 'available';
      default:
        return 'all';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType(null);
    setFormData({ message: '', milestone: '' });
  };

  const handleSubmit = async () => {
    try {
      // Handle different dialog types
      switch (dialogType) {
        case 'message':
          await sendMessage();
          break;
        case 'milestone':
          await submitMilestone();
          break;
        case 'review':
          await submitReview();
          break;
        default:
          break;
      }
      handleDialogClose();
      fetchJobs();
    } catch (err) {
      setError('Failed to submit');
      console.error(err);
    }
  };

  const sendMessage = async () => {
    // Implement message sending
  };

  const submitMilestone = async () => {
    // Implement milestone submission
  };

  const submitReview = async () => {
    // Implement review submission
  };

  const theme = useTheme(); // Make sure useTheme is imported and used if needed for direct theme access

  const getStatusChipProps = (status) => {
    const s = status.toLowerCase();
    const commonStyles = { fontWeight: 'medium', color: '#000000' };
    let specificSx = {};

    switch (s) {
      case 'active':
        specificSx = { ...commonStyles, backgroundColor: '#D4AF37' }; // Gold
        break;
      case 'completed':
        specificSx = { ...commonStyles, backgroundColor: '#81C784' }; // Light Green
        break;
      case 'pending': // Assuming 'available' might map to a 'pending worker action' or similar
      case 'available':
        specificSx = { ...commonStyles, backgroundColor: '#FFB74D' }; // Orange/Amber for pending/available
        break;
      case 'cancelled':
        specificSx = { ...commonStyles, backgroundColor: '#E57373' }; // Light Red
        break;
      default:
        specificSx = { backgroundColor: '#9E9E9E', color: '#FFFFFF' }; // Grey
        break;
    }
    return { sx: specificSx };
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
    mt: 1 // Add margin top for better spacing in dialog
  };

  const renderJobCard = (job) => (
    <Card key={job.id} sx={{ mb: 2, backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
      <CardContent sx={{pb: 1}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{color: '#D4AF37', fontWeight: 'bold'}}>{job.title}</Typography>
            <Typography variant="body2" sx={{color: '#B0B0B0'}}>
              Hirer: {job.hirerName || 'N/A'}
            </Typography>
          </Box>
          <Chip
            label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            size="small"
            {...getStatusChipProps(job.status)}
          />
        </Box>
        <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.2)' }} />
        <Grid container spacing={1}> {/* Reduced spacing for denser info */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{color: '#B0B0B0'}}>Budget:</Typography>
            <Typography variant="body1" sx={{color: '#E0E0E0', fontWeight:'medium'}}>
              ${job.budget || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{color: '#B0B0B0'}}>Deadline:</Typography>
            <Typography variant="body1" sx={{color: '#E0E0E0', fontWeight:'medium'}}>
              {job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{mt:1}}>
            <Typography variant="caption" sx={{color: '#B0B0B0'}}>Description:</Typography>
            <Typography variant="body2" sx={{color: '#E0E0E0', maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {job.description || 'No description provided.'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ borderColor: 'rgba(212,175,55,0.2)' }}/>
      <CardActions sx={{ justifyContent: 'space-between', p:1.5 }}> {/* Adjusted padding and justification */}
        <Box>
            <Button
              size="small"
              startIcon={<MessageIcon />}
              onClick={() => handleDialogOpen('message')}
              sx={{color: '#D4AF37', '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)'}}}
            >
              Message Hirer
            </Button>
            {job.status === 'active' && (
              <Button
                size="small"
                startIcon={<AssessmentIcon />}
                onClick={() => handleDialogOpen('milestone')}
                sx={{color: '#D4AF37', ml:1, '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)'}}}
              >
                Submit Milestone
              </Button>
            )}
        </Box>
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, job)}
          sx={{color: '#D4AF37'}}
        >
          <MoreVertIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{color: '#FFFFFF'}}> {/* Assuming parent page sets dark background */}
      <Typography variant="h5" gutterBottom sx={{color: '#D4AF37', fontWeight:'bold', mb:2}}>
        My Jobs
      </Typography>

      <Paper sx={{ mb: 3, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'rgba(212,175,55,0.2)',
            '& .MuiTabs-indicator': { backgroundColor: '#D4AF37' },
            '& .MuiTab-root': {
              color: '#B0B0B0',
              '&.Mui-selected': { color: '#D4AF37', fontWeight: 'bold' },
              '& .MuiSvgIcon-root': { mr: 1 }
            },
            '& .MuiTabs-scrollButtons': { color: '#D4AF37' }
          }}
        >
          <Tab
            icon={<WorkIcon />}
            label="Active Jobs"
            iconPosition="start"
          />
          <Tab
            icon={<CheckCircleIcon />}
            label="Completed"
            iconPosition="start"
          />
          <Tab // Consider renaming "Available" if it means something specific like "Invitations"
            icon={<PendingIcon />}
            label="Invitations" // Tentatively renaming for clarity
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(229,115,115,0.1)', color: '#E57373', '& .MuiAlert-icon': {color: '#E57373'} }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress sx={{color: '#D4AF37'}}/>
        </Box>
      ) : jobs.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#1F1F1F', borderRadius: 2 }}>
          <WorkOutlineIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
          <Typography sx={{color: '#B0B0B0'}}>
            No jobs found in this category.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {jobs.map(renderJobCard)}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{sx: {backgroundColor: '#2C2C2C', color: '#FFFFFF', border: '1px solid rgba(212,175,55,0.3)'}}}
      >
        <MenuItem onClick={() => handleDialogOpen('message')} sx={{ '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)'} }}>
          <MessageIcon sx={{ mr: 1, color: '#D4AF37' }} /> Send Message
        </MenuItem>
        {selectedJob?.status === 'active' && (
          <MenuItem onClick={() => handleDialogOpen('milestone')} sx={{ '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)'} }}>
            <AssessmentIcon sx={{ mr: 1, color: '#D4AF37' }} /> Submit Milestone
          </MenuItem>
        )}
        {selectedJob?.status === 'completed' && (
          // Assuming review is by hirer, so this might be "View Review" or not present for worker
          <MenuItem onClick={() => handleDialogOpen('review')} sx={{ '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)'} }}>
            <ReceiptIcon sx={{ mr: 1, color: '#D4AF37' }} /> View Details/Review
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{sx: {backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2, border:'1px solid rgba(212,175,55,0.3)'}}}
      >
        <DialogTitle sx={{color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.2)'}}>
          {dialogType === 'message' && `Message Hirer for "${selectedJob?.title}"`}
          {dialogType === 'milestone' && `Submit Milestone for "${selectedJob?.title}"`}
          {dialogType === 'review' && `Details for "${selectedJob?.title}"`}
        </DialogTitle>
        <DialogContent sx={{pt: '20px !important'}}>
          <Box> {/* Removed pt:2, relying on DialogContent's default or adjusted padding */}
            {dialogType === 'message' && (
              <TextField
                fullWidth
                label="Your Message"
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                sx={commonTextFieldStyles}
                autoFocus
              />
            )}
            {dialogType === 'milestone' && (
              <TextField
                fullWidth
                label="Milestone Description / Update"
                multiline
                rows={4}
                value={formData.milestone}
                onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                sx={commonTextFieldStyles}
                autoFocus
              />
            )}
            {dialogType === 'review' && (
              // This section might display job details or review if available
              <Typography sx={{color: '#E0E0E0'}}>Details about the completed job or review would be displayed here.</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{borderTop: '1px solid rgba(212,175,55,0.2)', p:2}}>
          <Button onClick={handleDialogClose} sx={{color: '#B0B0B0'}}>Cancel</Button>
          {dialogType !== 'review' && ( // Only show submit for message/milestone
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={dialogType === 'message' ? !formData.message.trim() : !formData.milestone.trim()}
              sx={{
                backgroundColor: '#D4AF37',
                color: '#000000',
                '&:hover': { backgroundColor: '#BF953F' },
                '&.Mui-disabled': {backgroundColor: 'rgba(212,175,55,0.5)', color: 'rgba(0,0,0,0.5)'}
              }}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobManagement; 


