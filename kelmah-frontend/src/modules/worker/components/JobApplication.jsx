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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/contexts/AuthContext';
import { format } from 'date-fns';

const JobApplication = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedBudget: '',
    estimatedTime: '',
    availability: '',
    additionalNotes: ''
  });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs/available');
      const data = await response.json();
      setAvailableJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load available jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setActiveStep(1);
  };

  const handleInputChange = (field) => (event) => {
    setApplicationData({
      ...applicationData,
      [field]: event.target.value
    });
  };

  const handlePreview = () => {
    setPreviewDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          workerId: user.id,
          ...applicationData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Reset form and go back to job selection
      setSelectedJob(null);
      setApplicationData({
        coverLetter: '',
        proposedBudget: '',
        estimatedTime: '',
        availability: '',
        additionalNotes: ''
      });
      setActiveStep(0);
      setError(null);
    } catch (err) {
      setError('Failed to submit application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme(); // Ensure useTheme is imported

  const commonTextFieldStyles = {
    '& label.Mui-focused': { color: '#D4AF37' },
    '& .MuiOutlinedInput-root': {
      color: '#FFFFFF',
      '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
      '&:hover fieldset': { borderColor: '#D4AF37' },
      '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
      '& .MuiSvgIcon-root': { color: '#D4AF37' }
    },
    '& .MuiInputLabel-root': { color: '#B0B0B0' },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
  };

  const themedButtonContainedSx = {
    backgroundColor: '#D4AF37',
    color: '#000000',
    '&:hover': { backgroundColor: '#BF953F' },
    '&.Mui-disabled': {backgroundColor: 'rgba(212,175,55,0.5)', color: 'rgba(0,0,0,0.5)'}
  };

  const themedButtonOutlinedSx = {
    color: '#D4AF37',
    borderColor: 'rgba(212,175,55,0.5)',
    '&:hover': { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)' },
  };

  const renderJobCard = (job) => (
    <Card
        key={job.id}
        sx={{
            mb: 2,
            cursor: 'pointer',
            backgroundColor: selectedJob?.id === job.id ? 'rgba(212,175,55,0.15)' : '#2C2C2C', // Highlight selected
            border: selectedJob?.id === job.id ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: 'rgba(212,175,55,0.1)'}
        }}
        onClick={() => handleJobSelect(job)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{color: '#D4AF37'}}>{job.title}</Typography>
            <Typography variant="body2" sx={{color: '#B0B0B0'}}>
              {job.hirerName}
            </Typography>
          </Box>
          <Chip
            label={`$${job.budget}`}
            size="small"
            icon={<AttachMoneyIcon sx={{color: '#000000 !important'}}/>}
            sx={{backgroundColor: '#D4AF37', color: '#000000', fontWeight:'medium'}}
          />
        </Box>
        <Divider sx={{ my: 1, borderColor: 'rgba(212,175,55,0.2)' }} />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{color: '#B0B0B0'}}>Posted:</Typography>
            <Typography variant="body2" sx={{color: '#E0E0E0'}}>
              {format(new Date(job.postedAt), 'MMM dd, yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{color: '#B0B0B0'}}>Deadline:</Typography>
            <Typography variant="body2" sx={{color: '#E0E0E0'}}>
              {format(new Date(job.deadline), 'MMM dd, yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{mt:0.5}}>
            <Typography variant="caption" sx={{color: '#B0B0B0'}}>Description:</Typography>
            <Typography variant="body2" sx={{color: '#E0E0E0', maxHeight: 40, overflow:'hidden', textOverflow:'ellipsis'}}>
              {job.description}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{mt:0.5}}>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {job.requiredSkills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{color: '#D4AF37', borderColor: 'rgba(212,175,55,0.5)'}}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const steps = [
    {
      label: 'Select Job to Apply For',
      content: (
        <Box>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress sx={{color: '#D4AF37'}}/>
            </Box>
          ) : availableJobs.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#2C2C2C', color: '#B0B0B0' }}>
                 <WorkIcon sx={{ fontSize: 48, color: '#D4AF37', mb: 1 }} />
              <Typography>
                No available jobs found at the moment.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{maxHeight: '400px', overflowY: 'auto', pr:1}}> {/* Scrollable job list */}
              {availableJobs.map(renderJobCard)}
            </Box>
          )}
        </Box>
      )
    },
    {
      label: 'Craft Your Proposal',
      content: (
        <Box>
          {selectedJob && <Typography variant="h6" sx={{color: '#D4AF37', mb:2}}>Applying for: {selectedJob.title}</Typography>}
          <Grid container spacing={2}> {/* Reduced spacing */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Cover Letter"
                multiline
                rows={5} // Slightly reduced
                value={applicationData.coverLetter}
                onChange={handleInputChange('coverLetter')}
                required
                sx={commonTextFieldStyles}
                placeholder="Explain why you are a great fit for this job..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Proposed Budget ($)"
                type="number"
                value={applicationData.proposedBudget}
                onChange={handleInputChange('proposedBudget')}
                InputProps={{
                  startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: '#B0B0B0' }} />
                }}
                required
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Time to Complete"
                value={applicationData.estimatedTime}
                onChange={handleInputChange('estimatedTime')}
                InputProps={{
                  startAdornment: <ScheduleIcon sx={{ mr: 1, color: '#B0B0B0' }} />
                }}
                required
                sx={commonTextFieldStyles}
                placeholder="e.g., 2 weeks, 10 hours"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Availability"
                value={applicationData.availability}
                onChange={handleInputChange('availability')}
                required
                sx={commonTextFieldStyles}
                placeholder="e.g., Available immediately, Mon-Fri 9am-5pm"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes (Optional)"
                multiline
                rows={3} // Slightly reduced
                value={applicationData.additionalNotes}
                onChange={handleInputChange('additionalNotes')}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt:1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  startIcon={<CloseIcon />}
                  sx={{color: '#B0B0B0', borderColor: 'rgba(255,255,255,0.3)', '&:hover': {borderColor: '#FFFFFF'}}}
                >
                  Back to Jobs
                </Button>
                <Button
                  variant="outlined"
                  onClick={handlePreview}
                  startIcon={<DescriptionIcon />}
                  sx={themedButtonOutlinedSx}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<SendIcon />}
                  disabled={loading || !applicationData.coverLetter.trim() || !applicationData.proposedBudget.trim() || !applicationData.estimatedTime.trim() || !applicationData.availability.trim()} // Basic validation
                  sx={themedButtonContainedSx}
                >
                  Submit Application
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{color: '#FFFFFF', p: {xs: 1, sm:2} /* Assuming parent page has dark bg */ }}>
      <Typography variant="h5" gutterBottom sx={{color: '#D4AF37', fontWeight:'bold', mb:2}}>
        Submit Your Job Application
      </Typography>

      {error && (
        <Alert
            severity="error"
            sx={{ mb: 2, backgroundColor: 'rgba(229,115,115,0.1)', color: '#E57373', '& .MuiAlert-icon': {color: '#E57373'} }}
        >
          {error}
        </Alert>
      )}

      <Paper sx={{ p: {xs:2, sm:3}, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
        <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
                '& .MuiStepLabel-label': {
                    color: '#B0B0B0',
                    '&.Mui-active': { color: '#D4AF37', fontWeight: 'medium' },
                    '&.Mui-completed': { color: '#81C784' }
                },
                '& .MuiStepIcon-root': {
                    color: 'rgba(212,175,55,0.3)',
                    '&.Mui-active': { color: '#D4AF37' },
                    '&.Mui-completed': { color: '#81C784' }
                },
                '& .MuiStepConnector-line': {
                    borderColor: 'rgba(212,175,55,0.3)'
                }
            }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent sx={{borderLeftColor: 'rgba(212,175,55,0.3)'}}> {/* Themed connector line */}
                {step.content}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{sx: {backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2, border: '1px solid rgba(212,175,55,0.3)'}}}
      >
        <DialogTitle sx={{color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.2)'}}>
          Application Preview
        </DialogTitle>
        <DialogContent sx={{pt: '20px !important'}}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{color: '#D4AF37'}}>
              {selectedJob?.title}
            </Typography>
            <Typography variant="body2" sx={{color: '#B0B0B0'}} gutterBottom>
              For: {selectedJob?.hirerName}
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.2)' }} />

            <Typography variant="subtitle1" gutterBottom sx={{color: '#E0E0E0', fontWeight:'medium'}}>Cover Letter:</Typography>
            <Typography variant="body2" paragraph sx={{color: '#E0E0E0', whiteSpace: 'pre-wrap', maxHeight: 150, overflowY: 'auto', p:1, border: '1px solid rgba(255,255,255,0.1)', borderRadius:1}}>
              {applicationData.coverLetter}
            </Typography>

            <Grid container spacing={1} sx={{mt:1}}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{color: '#B0B0B0'}}>Proposed Budget:</Typography>
                <Typography variant="body1" sx={{color: '#E0E0E0'}}>${applicationData.proposedBudget}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{color: '#B0B0B0'}}>Estimated Time:</Typography>
                <Typography variant="body1" sx={{color: '#E0E0E0'}}>{applicationData.estimatedTime}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{color: '#B0B0B0'}}>Availability:</Typography>
                <Typography variant="body1" sx={{color: '#E0E0E0'}}>{applicationData.availability}</Typography>
              </Grid>
              {applicationData.additionalNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{color: '#B0B0B0'}}>Additional Notes:</Typography>
                  <Typography variant="body2" sx={{color: '#E0E0E0', whiteSpace: 'pre-wrap', maxHeight: 100, overflowY: 'auto', p:1, border: '1px solid rgba(255,255,255,0.1)', borderRadius:1}}>
                    {applicationData.additionalNotes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{borderTop: '1px solid rgba(212,175,55,0.2)', p:2}}>
          <Button onClick={() => setPreviewDialogOpen(false)} sx={{color: '#B0B0B0'}}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobApplication; 



