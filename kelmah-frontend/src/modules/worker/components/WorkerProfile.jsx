import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/contexts/AuthContext';
import workerService from '../services/workerService';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Rating,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Alert,
    Card,
    CardContent,
    Chip,
    IconButton,
    LinearProgress,
    Tabs,
    Tab,
    Stack,
    Badge,
    Tooltip,
    Menu,
    MenuItem,
    Skeleton,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    LocationOn as LocationIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LinkedIn as LinkedInIcon,
    Language as WebsiteIcon,
    Work as WorkIcon,
    AttachMoney as MoneyIcon,
    AccessTime as TimeIcon,
    Verified as VerifiedIcon,
    Add as AddIcon,
    PhotoCamera as CameraIcon,
    Upload as UploadIcon,
    MoreVert as MoreIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)',
    margin: 'auto',
    backgroundColor: theme.palette.primary.main,
}));

const SkillBar = ({ name, level }) => {
    const theme = useTheme();
    const percentage = (level / 5) * 100;
    
    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                    {name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0B0B0'}}> {/* Light grey for level text */}
                    {level}/5
                </Typography>
            </Box>
            <LinearProgress 
                variant="determinate" 
                value={percentage} 
                sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(212, 175, 55, 0.2)', // Light gold background for progress bar
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#D4AF37', // Gold progress bar
                    }
                }}
            />
        </Box>
    );
};

const PortfolioItem = ({ image, title, description, onClick }) => {
    return (
        <Card 
            sx={{ 
                height: 220, 
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
                },
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                borderRadius: 2,
                overflow: 'hidden'
            }}
            onClick={onClick}
        >
            <Box 
                sx={{ 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                    p: 2,
                    color: 'white'
                }}
            >
                <Typography variant="subtitle1" fontWeight={700}>
                    {title}
                </Typography>
                <Typography variant="body2" noWrap>
                    {description}
                </Typography>
            </Box>
        </Card>
    );
};

function WorkerProfile() {
    const { user: authUser } = useAuth();
    const { workerId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [workHistory, setWorkHistory] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const isOwner = authUser?.userId === workerId;

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const profileRes = await workerService.getWorkerById(workerId);
            setProfile(profileRes.data);

            const [skillsRes, portfolioRes, certsRes, reviewsRes, historyRes] = await Promise.all([
                workerService.getWorkerSkills(workerId),
                workerService.getWorkerPortfolio(workerId),
                workerService.getWorkerCertificates(workerId),
                workerService.getWorkerReviews(workerId),
                workerService.getWorkHistory(workerId)
            ]);

            setSkills(skillsRes.data);
            setPortfolio(portfolioRes.data);
            setCertificates(certsRes.data);
            setReviews(reviewsRes.data);
            setWorkHistory(historyRes.data);

        } catch (err) {
            setError('Failed to load profile data. The worker may not exist or there was a network error.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [workerId]);

    useEffect(() => {
        if(workerId) {
            fetchAllData();
        }
    }, [workerId, fetchAllData]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            await workerService.uploadProfileImage(workerId, formData);
            fetchAllData(); // Refresh data
        } catch (err) {
            setError('Failed to upload image');
            console.error(err);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: -9 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={150} height={150} sx={{ border: `4px solid ${theme.palette.background.paper}` }} />
                    <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
                    <Skeleton variant="text" width="30%" height={30} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 4, borderRadius: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2, borderRadius: 2 }} />
            </Box>
        );
    }

    if (error || !profile) {
        return <Alert severity="error" sx={{ m: 3 }}>{error || 'Could not load worker profile.'}</Alert>;
    }

    return (
        // Adjusted main background for better contrast with gold/white elements
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, background: '#121212', color: '#FFFFFF' }}>
            {/* Profile Header Card */}
            <Card 
                elevation={3} 
                sx={{ 
                    mb: 3, 
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: '0 8px 32px 0 rgba(212, 175, 55, 0.2)', // Gold shadow
                    background: '#1F1F1F', // Dark card background
                    color: '#FFFFFF'
                }}
            >
                {/* Cover Image - Using Gold Gradient */}
                <Box 
                    sx={{ 
                        height: 220, 
                        width: '100%', 
                        background: `linear-gradient(45deg, #D4AF37 30%, #BF953F 90%)`, // Gold gradient
                        borderTopLeftRadius: theme.shape.borderRadius * 2,
                        borderTopRightRadius: theme.shape.borderRadius * 2,
                        position: 'relative'
                    }}
                >
                    {isOwner && (
                        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                            <Button 
                                variant="contained"
                                startIcon={<EditIcon />}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.7)', // Darker button
                                    color: '#D4AF37', // Gold text
                                    borderColor: '#D4AF37',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.9)', borderColor: '#D4AF37' }
                                }}
                                onClick={() => navigate(`/worker/profile/edit`)}
                            >
                                Edit Profile
                            </Button>
                        <IconButton 
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                    color: '#D4AF37',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                                }}
                            onClick={handleMenuOpen}
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                    )}
                </Box>

                {/* Profile Menu */}
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            background: '#2C2C2C', // Dark menu
                            color: '#FFFFFF',
                        },
                    }}
                >
                    <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' } }}>Download CV</MenuItem>
                    <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' } }}>Share Profile</MenuItem>
                </Menu>
                
                {/* Profile Avatar & Info */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        mt: -10 // Keep avatar overlap
                    }}
                >
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            isOwner ? (
                                <label htmlFor="profile-image-upload">
                                <Input
                                    accept="image/*"
                                        id="profile-image-upload"
                                    type="file"
                                    onChange={handleImageUpload}
                                />
                                <IconButton 
                                    component="span" 
                                    sx={{ 
                                        bgcolor: '#D4AF37', // Gold background for camera icon
                                        color: '#000000', // Black icon for contrast
                                            border: `2px solid #1F1F1F`, // Card background for border
                                            '&:hover': { bgcolor: '#BF953F' } // Darker gold
                                    }}
                                >
                                        <CameraIcon fontSize="small" />
                                </IconButton>
                            </label>
                            ) : null
                        }
                    >
                        <ProfileAvatar // Already styled, check if backgroundColor needs adjustment
                            src={profile.profile_image_url}
                            alt={profile.user.name}
                            sx={{ backgroundColor: '#D4AF37' }} // Gold fallback for avatar
                        >
                            {profile.user.name?.charAt(0)}
                        </ProfileAvatar>
                    </Badge>

                    <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFFFFF' }}> {/* White name */}
                                {profile.user.name}
                            </Typography>
                            {profile.is_verified && (
                                <Tooltip title="Verified Worker: This worker has completed our verification process.">
                                    <VerifiedIcon sx={{ ml: 1, fontSize: '28px', color: '#D4AF37' }} /> {/* Gold verified icon */}
                                </Tooltip>
                            )}
                        </Box>
                        
                        <Typography variant="h6" sx={{ color: '#D4AF37' }} gutterBottom fontWeight={500}> {/* Gold profession */}
                            {profile.profession}
                        </Typography>
                        
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                            <Rating 
                                value={profile.average_rating || 0} 
                                precision={0.5}
                                readOnly 
                                emptyIcon={<StarIcon style={{ opacity: 0.55, color: '#BF953F' }} fontSize="inherit" />}
                                icon={<StarIcon fontSize="inherit" sx={{ color: '#D4AF37' }} />} // Gold stars
                            />
                            <Typography variant="body1" sx={{ color: '#B0B0B0' }}> {/* Lighter grey for review count */}
                                ({reviews.length} reviews)
                            </Typography>
                        </Stack>
                        
                        <Typography 
                            variant="body1" 
                            sx={{ maxWidth: 600, mx: 'auto', mb: 3, lineHeight: 1.6, color: '#E0E0E0' }} // Light grey bio
                        >
                            {profile.bio || "This worker hasn't added a bio yet."}
                        </Typography>
                        
                        <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={1.5} 
                            justifyContent="center"
                            sx={{ mb: 3 }}
                            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(212, 175, 55, 0.3)'}} />}
                        >
                            <Chip icon={<WorkIcon sx={{color: '#D4AF37'}}/>} label={`${profile.experience_years || 0} years experience`} variant="outlined" sx={{color: '#D4AF37', borderColor: '#D4AF37'}} />
                            <Chip icon={<MoneyIcon sx={{color: '#D4AF37'}}/>} label={`$${profile.hourly_rate || 'N/A'}/hour`} variant="outlined" sx={{color: '#D4AF37', borderColor: '#D4AF37'}} />
                            <Chip icon={<LocationIcon sx={{color: '#D4AF37'}}/>} label={profile.location || 'Not specified'} variant="outlined" sx={{color: '#D4AF37', borderColor: '#D4AF37'}} />
                        </Stack>
                        
                         <Stack direction="row" spacing={1} justifyContent="center">
                            {profile.contact?.email && <IconButton component="a" href={`mailto:${profile.contact.email}`} sx={{color: '#D4AF37'}}><EmailIcon /></IconButton>}
                            {profile.contact?.website && <IconButton component="a" href={profile.contact.website} target="_blank" sx={{color: '#D4AF37'}}><WebsiteIcon /></IconButton>}
                            {profile.contact?.linkedin && <IconButton component="a" href={profile.contact.linkedin} target="_blank" sx={{color: '#D4AF37'}}><LinkedInIcon /></IconButton>}
                            {profile.contact?.phone && <IconButton component="a" href={`tel:${profile.contact.phone}`} sx={{color: '#D4AF37'}}><PhoneIcon /></IconButton>}
                        </Stack>
                    </Box>
                </Box>
            </Card>

            {/* Tabs navigation */}
            <Paper sx={{ mb: 3, background: '#1F1F1F', borderRadius: 2 }}> {/* Dark paper for tabs */}
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="inherit" // Use inherit to allow styling override
                    indicatorColor="primary" // This will use the theme's primary (Gold)
                    sx={{
                        '& .MuiTab-root': {
                            minWidth: 0,
                            px: {xs: 2, sm:3},
                            color: '#B0B0B0', // Light grey for inactive tabs
                            '&.Mui-selected': {
                                color: '#D4AF37', // Gold for active tab text
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#D4AF37', // Gold indicator
                        },
                    }}
                >
                    <Tab label="Skills" />
                    <Tab label="Portfolio" />
                    <Tab label="Reviews" />
                    <Tab label="Certificates" />
                    <Tab label="Work History" />
                </Tabs>
            </Paper>

            {/* Tab panels - Wrap content in Paper for consistent styling */}
            <Paper sx={{ p: {xs:1, sm:2, md:3}, background: '#1F1F1F', color: '#FFFFFF', borderRadius:2 }}>
                {tabValue === 0 && (
                  <Box>
                    {skills.length === 0 ? (
                      <Alert severity="info" sx={{backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37'}}>No skills listed. Add your skills to attract more hirers!</Alert>
                    ) : (
                      skills.map((skill) => (
                        <SkillBar key={skill.id} name={skill.name} level={skill.level} />
                      ))
                    )}
                  </Box>
                )}
                {tabValue === 1 && (
                  <Box>
                    {portfolio.length === 0 ? (
                      <Alert severity="info" sx={{backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37'}}>Your portfolio is empty. Add projects to showcase your work!</Alert>
                    ) : (
                      <Grid container spacing={2}>
                                {portfolio.map((item) => (
                          <Grid item xs={12} sm={6} md={4} key={item.id}>
                                        <PortfolioItem
                              image={item.image_url || `https://via.placeholder.com/300x200/000000/D4AF37?text=${encodeURIComponent(item.title)}`} // Placeholder with theme
                                            title={item.title}
                                            description={item.description}
                              onClick={() => { /* Implement view item modal later */ }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                    )}
                  </Box>
                )}
                {tabValue === 2 && (
                  <Box>
                    {reviews.length === 0 ? (
                      <Alert severity="info" sx={{backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37'}}>No reviews yet. Hirers can leave reviews after a job is completed.</Alert>
                    ) : (
                                <List sx={{ color: '#E0E0E0' }}>
                        {reviews.map((review, index) => (
                          <React.Fragment key={review.id}>
                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                <Avatar src={review.reviewer?.avatar_url} sx={{bgcolor: '#D4AF37'}} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" sx={{color: '#FFFFFF'}}>
                                      {review.reviewer?.name || 'Anonymous'}
                                                            </Typography>
                                    <Rating
                                      value={review.rating}
                                      readOnly
                                      size="small"
                                                          sx={{ ml: 1, '& .MuiRating-iconFilled': { color: '#D4AF37' }, '& .MuiRating-iconEmpty': { color: 'rgba(212, 175, 55, 0.3)'} }}
                                    />
                                                        </Box>
                                                    }
                                                    secondary={
                                  <Typography variant="body2" sx={{ mt: 1, color: '#B0B0B0' }}>
                                                                {review.comment}
                                                            </Typography>
                                                    }
                                                />
                                            </ListItem>
                            {index < reviews.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(212, 175, 55, 0.2)'}} />}
                                        </React.Fragment>
                                    ))}
                                </List>
                    )}
                  </Box>
                )}
                {tabValue === 3 && (
                  <Box>
                    {certificates.length === 0 ? (
                      <Alert severity="info" sx={{backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37'}}>No certificates uploaded. Add your certifications to build trust!</Alert>
                    ) : (
                      <Grid container spacing={2}>
                        {certificates.map((cert) => (
                          <Grid item xs={12} sm={6} md={4} key={cert.id}>
                            <Card sx={{background: '#2C2C2C', color: '#FFFFFF', borderColor: '#D4AF37', borderWidth: 1, borderStyle: 'solid'}}>
                              <CardContent>
                                <Typography variant="h6" sx={{color: '#D4AF37'}}>{cert.name}</Typography>
                                {cert.issuer && (
                                  <Typography variant="body2" sx={{color: '#E0E0E0'}}>
                                    Issued by: {cert.issuer}
                                                        </Typography>
                                                        )}
                                {cert.date && (
                                                        <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                                    Date: {new Date(cert.date).toLocaleDateString()}
                                                        </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
                {tabValue === 4 && (
                  <Box>
                    {workHistory.length === 0 ? (
                      <Alert severity="info" sx={{backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37'}}>No work history available. Add your past jobs to show your experience!</Alert>
                    ) : (
                                <List sx={{ color: '#E0E0E0' }}>
                        {workHistory.map((job, index) => (
                          <React.Fragment key={job.id}>
                            <ListItem alignItems="flex-start">
                                                <ListItemText
                                                    primary={
                                  <Typography variant="subtitle1" sx={{color: '#FFFFFF'}}>
                                    {job.position} at {job.company}
                                                            </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" sx={{color: '#B0B0B0'}}>
                                      {job.start_date} - {job.end_date || 'Present'}
                                                            </Typography>
                                    <Typography variant="body2" sx={{ mt: 1, color: '#E0E0E0' }}>
                                      {job.description}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                            {index < workHistory.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(212, 175, 55, 0.2)'}} />}
                                        </React.Fragment>
                                    ))}
                                </List>
                    )}
                </Box>
                )}
            </Paper>
        </Box>
    );
}

export default WorkerProfile;


