import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as CameraIcon,
  AddCircleOutline as AddIcon,
  Delete as DeleteIcon,
  BusinessCenter as BusinessIcon,
  LocationOn as LocationIcon,
  MonetizationOn as RateIcon,
  School as EducationIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
  Build as SkillsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { updateWorkerProfile, fetchWorkerProfile } from '../services/workerSlice';

const Input = styled('input')({
  display: 'none',
});

const WorkerProfileEditPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { user } = useSelector(state => state.auth);
  const { profile, loading, error } = useSelector(state => state.worker);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    bio: '',
    hourlyRate: '',
    experience: '',
    skills: [],
    education: [],
    languages: [],
    location: '',
    phone: '',
    profileImage: null,
    portfolio: []
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });
  const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: 'Beginner' });
  
  // Load profile data when component mounts
  useEffect(() => {
    dispatch(fetchWorkerProfile())
      .unwrap()
      .then(profile => {
        // Populate form with existing profile data
        setFormData({
          firstName: profile.firstName || user?.firstName || '',
          lastName: profile.lastName || user?.lastName || '',
          title: profile.title || '',
          bio: profile.bio || '',
          hourlyRate: profile.hourlyRate || '',
          experience: profile.experience || '',
          skills: profile.skills || [],
          education: profile.education || [],
          languages: profile.languages || [],
          location: profile.location || '',
          phone: profile.phone || '',
          profileImage: null, // Will be populated only when user changes it
          portfolio: profile.portfolio || []
        });
        
        setImagePreview(profile.profileImageUrl);
      })
      .catch(err => {
        console.error('Error loading profile:', err);
        setSnackbar({
          open: true,
          message: 'Failed to load profile. Please try again.',
          severity: 'error'
        });
      });
  }, [dispatch, user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Skills handling
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  // Education handling
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }));
      setNewEducation({ degree: '', institution: '', year: '' });
    }
  };
  
  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };
  
  // Language handling
  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddLanguage = () => {
    if (newLanguage.language) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage }]
      }));
      setNewLanguage({ language: '', proficiency: 'Beginner' });
    }
  };
  
  const handleRemoveLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };
  
  // Portfolio handling
  const handleAddPortfolioItem = () => {
    setFormData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, { title: '', description: '', image: null, imagePreview: null }]
    }));
  };
  
  const handleRemovePortfolioItem = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };
  
  const handlePortfolioItemChange = (index, field, value) => {
    const updatedPortfolio = [...formData.portfolio];
    updatedPortfolio[index] = {
      ...updatedPortfolio[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      portfolio: updatedPortfolio
    }));
  };
  
  const handlePortfolioImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPortfolio = [...formData.portfolio];
      updatedPortfolio[index] = {
        ...updatedPortfolio[index],
        image: file
      };
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedPortfolio[index].imagePreview = reader.result;
        setFormData(prev => ({
          ...prev,
          portfolio: updatedPortfolio
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for file uploads
    const profileFormData = new FormData();
    
    // Add profile fields
    Object.keys(formData).forEach(key => {
      if (key === 'profileImage' && formData[key]) {
        profileFormData.append('profileImage', formData[key]);
      } else if (key === 'skills' || key === 'education' || key === 'languages' || key === 'portfolio') {
        profileFormData.append(key, JSON.stringify(formData[key]));
      } else {
        profileFormData.append(key, formData[key]);
      }
    });
    
    // Add portfolio images if any
    formData.portfolio.forEach((item, index) => {
      if (item.image) {
        profileFormData.append(`portfolioImage${index}`, item.image);
      }
    });
    
    try {
      await dispatch(updateWorkerProfile(profileFormData)).unwrap();
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
      
      // Navigate back to profile page after successful update
      setTimeout(() => {
        navigate('/worker/profile');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    }
  };
  
  const handleCancel = () => {
    navigate('/worker/profile');
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  const commonTextFieldStyles = {
    '& label.Mui-focused': { color: '#D4AF37' },
    '& .MuiInput-underline:after': { borderBottomColor: '#D4AF37' },
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

  const commonSelectStyles = {
    color: '#FFFFFF',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.3)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
    '& .MuiSvgIcon-root': { color: '#D4AF37' },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
  };

  const menuItemStyles = {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
    '&.Mui-selected': {
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.3)' }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, background: '#121212', color: '#FFFFFF', minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{color: '#D4AF37'}}>
          Edit Your Profile
        </Typography>
        <Typography variant="body1" sx={{color: '#B0B0B0'}}>
          Complete your profile to attract more job opportunities
        </Typography>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
                width: '100%',
                backgroundColor: snackbar.severity === 'success' ? 'rgba(212,175,55,0.1)' : 'rgba(229,115,115,0.1)' , // Gold tint for success, red for error
                color: snackbar.severity === 'success' ? '#D4AF37' : '#E57373',
                '& .MuiAlert-icon': { color: snackbar.severity === 'success' ? '#D4AF37' : '#E57373' }
            }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(229,115,115,0.1)', color: '#E57373', '& .MuiAlert-icon': { color: '#E57373'} }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: {xs:2, md:3}, mb: 4, borderRadius: 2, backgroundColor: '#1F1F1F', boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'medium', borderBottom: '1px solid rgba(212,175,55,0.2)', pb:1, mb:3 }}>
            Basic Information
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={imagePreview}
              alt={`${formData.firstName} ${formData.lastName}`}
              sx={{ width: 150, height: 150, mb: 2, border: '3px solid #D4AF37', backgroundColor: 'rgba(212,175,55,0.2)' }}
            />
            <label htmlFor="profile-image">
              <Input
                accept="image/*"
                id="profile-image"
                type="file"
                onChange={handleImageChange}
              />
              <Button
                component="span"
                variant="outlined"
                startIcon={<CameraIcon />}
                sx={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.5)', '&:hover': {borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)'} }}
              >
                Change Profile Picture
              </Button>
            </label>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Senior Plumber, Experienced Electrician"
                InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State/Province, Country"
                InputProps={{ startAdornment: (<InputAdornment position="start"><LocationIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                sx={commonTextFieldStyles}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: {xs:2, md:3}, mb: 4, borderRadius: 2, backgroundColor: '#1F1F1F', boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'medium', borderBottom: '1px solid rgba(212,175,55,0.2)', pb:1, mb:3 }}>
            Professional Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                InputProps={{ startAdornment: (<InputAdornment position="start"><RateIcon /></InputAdornment>), }}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Tell potential clients about yourself, your experience, and why they should hire you."
                InputProps={{ startAdornment: (<InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DescriptionIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: {xs:2, md:3}, mb: 4, borderRadius: 2, backgroundColor: '#1F1F1F', boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'medium', borderBottom: '1px solid rgba(212,175,55,0.2)', pb:1, mb:3 }}>
            Skills
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
              <TextField
                fullWidth
                label="Add a Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill();}}}
                placeholder="e.g. Plumbing, Electrical Installation, Carpentry"
                InputProps={{ startAdornment: (<InputAdornment position="start"><SkillsIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
              <Button
                variant="contained"
                onClick={handleAddSkill}
                startIcon={<AddIcon />}
                sx={{ backgroundColor: '#D4AF37', color: '#000000', '&:hover': { backgroundColor: '#BF953F' }, whiteSpace: 'nowrap' }}
              >
                Add Skill
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{
                    backgroundColor: 'rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                    borderColor: 'rgba(212,175,55,0.5)',
                    '& .MuiChip-deleteIcon': { color: '#D4AF37', '&:hover': {color: '#BF953F'} }
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Paper>
        
        <Paper elevation={3} sx={{ p: {xs:2, md:3}, mb: 4, borderRadius: 2, backgroundColor: '#1F1F1F', boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'medium', borderBottom: '1px solid rgba(212,175,55,0.2)', pb:1, mb:3 }}>
            Education & Certifications
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Degree/Certification"
                name="degree"
                value={newEducation.degree}
                onChange={handleEducationChange}
                placeholder="e.g. Certified Plumber"
                InputProps={{ startAdornment: (<InputAdornment position="start"><EducationIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Institution"
                name="institution"
                value={newEducation.institution}
                onChange={handleEducationChange}
                placeholder="e.g. Trade School"
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                value={newEducation.year}
                onChange={handleEducationChange}
                placeholder="e.g. 2018"
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={1} sx={{display: 'flex', alignItems: 'center'}}>
              <Button
                variant="contained"
                onClick={handleAddEducation}
                fullWidth
                sx={{ height: 56, backgroundColor: '#D4AF37', color: '#000000', '&:hover': { backgroundColor: '#BF953F' } }}
              >
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
          
          {formData.education.length > 0 && (
            <Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.2)' }} />
              <Typography variant="subtitle1" gutterBottom sx={{color: '#E0E0E0'}}>
                Added Education & Certifications
              </Typography>
              
              {formData.education.map((edu, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 1, backgroundColor: '#2C2C2C', borderColor: 'rgba(212,175,55,0.3)' }}>
                  <CardContent sx={{ py: '12px !important', '&:last-child': { pb: '12px !important' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{color: '#FFFFFF'}}>
                          {edu.degree}
                        </Typography>
                        <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                          {edu.institution} {edu.year && `(${edu.year})`}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveEducation(index)}
                        sx={{color: '#E57373', '&:hover': {color: '#D32F2F'}}}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>
        
        <Paper elevation={3} sx={{ p: {xs:2, md:3}, mb: 4, borderRadius: 2, backgroundColor: '#1F1F1F', boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'medium', borderBottom: '1px solid rgba(212,175,55,0.2)', pb:1, mb:3 }}>
            Languages
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="flex-end">
            <Grid item xs={12} sm={5}> {/* Adjusted sm for better spacing */}
              <TextField
                fullWidth
                label="Language"
                name="language"
                value={newLanguage.language}
                onChange={handleLanguageChange}
                placeholder="e.g. English, Spanish"
                InputProps={{ startAdornment: (<InputAdornment position="start"><LanguageIcon /></InputAdornment>),}}
                sx={commonTextFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={isMobile ? 5 : 4}> {/* Adjusted sm for better spacing */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputLabel-root': { color: '#B0B0B0' } }}>
                <InputLabel id="language-proficiency-label">Proficiency</InputLabel>
                <Select
                  labelId="language-proficiency-label"
                  name="proficiency"
                  value={newLanguage.proficiency}
                  onChange={handleLanguageChange}
                  label="Proficiency"
                  sx={commonSelectStyles}
                  MenuProps={{ PaperProps: { sx: { backgroundColor: '#1F1F1F' }}}}
                >
                  <MenuItem value="Beginner" sx={menuItemStyles}>Beginner</MenuItem>
                  <MenuItem value="Intermediate" sx={menuItemStyles}>Intermediate</MenuItem>
                  <MenuItem value="Advanced" sx={menuItemStyles}>Advanced</MenuItem>
                  <MenuItem value="Native" sx={menuItemStyles}>Native/Fluent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={isMobile ? 2 : 1} sx={{display: 'flex', alignItems: 'center'}}>
              <Button
                variant="contained"
                onClick={handleAddLanguage}
                fullWidth
                sx={{ height: 56, backgroundColor: '#D4AF37', color: '#000000', '&:hover': { backgroundColor: '#BF953F' } }}
              >
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
          
          {formData.languages.length > 0 && (
            <Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.2)' }} />
              <Typography variant="subtitle1" gutterBottom sx={{color: '#E0E0E0'}}>
                Added Languages
              </Typography>
              
              {formData.languages.map((lang, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 1, backgroundColor: '#2C2C2C', borderColor: 'rgba(212,175,55,0.3)' }}>
                  <CardContent sx={{ py: '12px !important', '&:last-child': { pb: '12px !important' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{color: '#FFFFFF'}}>
                          {lang.language}
                        </Typography>
                        <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                          {lang.proficiency}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveLanguage(index)}
                        sx={{color: '#E57373', '&:hover': {color: '#D32F2F'}}}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>
        
        <Paper elevation={3} sx={{ p: {xs:2, md:3}, mb: 4, borderRadius: 2, backgroundColor: '#1F1F1F', boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'medium', borderBottom: '1px solid rgba(212,175,55,0.2)', pb:1, mb:3 }}>
            Portfolio
          </Typography>
          
          <Typography variant="body2" sx={{color: '#B0B0B0'}} gutterBottom>
            Add examples of your previous work to showcase your skills
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleAddPortfolioItem}
            startIcon={<AddIcon />}
            sx={{ mb: 3, color: '#D4AF37', borderColor: 'rgba(212,175,55,0.5)', '&:hover': {borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)'} }}
          >
            Add Portfolio Item
          </Button>
          
          <Grid container spacing={3}>
            {formData.portfolio.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" sx={{backgroundColor: '#2C2C2C', borderColor: 'rgba(212,175,55,0.3)', height: '100%', display:'flex', flexDirection:'column'}}>
                  <CardContent sx={{flexGrow: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{color: '#E0E0E0'}}>
                        Portfolio Item #{index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePortfolioItem(index)}
                        sx={{color: '#E57373', '&:hover': {color: '#D32F2F'}}}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="Title"
                      value={item.title || ''}
                      onChange={(e) => handlePortfolioItemChange(index, 'title', e.target.value)}
                      sx={{ ...commonTextFieldStyles, mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Description"
                      value={item.description || ''}
                      onChange={(e) => handlePortfolioItemChange(index, 'description', e.target.value)}
                      multiline
                      rows={2}
                      sx={{ ...commonTextFieldStyles, mb: 2 }}
                    />
                    
                    <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                      {item.imagePreview || item.image ? (
                        <Box
                          component="img"
                          src={item.imagePreview || (typeof item.image === 'string' ? item.image : '')} // Handle existing image URL
                          alt={item.title || 'Portfolio image'}
                          sx={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover',
                            mb: 2,
                            borderRadius: 1,
                            border: '1px solid rgba(212,175,55,0.3)'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: 150,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px dashed rgba(212,175,55,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                            No image selected
                          </Typography>
                        </Box>
                      )}
                      
                      <label htmlFor={`portfolio-image-${index}`}>
                        <Input
                          accept="image/*"
                          id={`portfolio-image-${index}`}
                          type="file"
                          onChange={(e) => handlePortfolioImageChange(e, index)}
                        />
                        <Button
                          component="span"
                          variant="outlined"
                          size="small"
                          startIcon={<CameraIcon />}
                          sx={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.5)', '&:hover': {borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)'} }}
                        >
                          {item.imagePreview || item.image ? 'Change Image' : 'Add Image'}
                        </Button>
                      </label>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
        
        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            size="large"
            sx={{
                color: '#B0B0B0',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.08)'}
            }}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            size="large"
            disabled={loading}
            sx={{
                backgroundColor: '#D4AF37',
                color: '#000000',
                '&:hover': { backgroundColor: '#BF953F' },
                '&.Mui-disabled': {backgroundColor: 'rgba(212,175,55,0.5)', color: 'rgba(0,0,0,0.5)'}
            }}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default WorkerProfileEditPage; 



