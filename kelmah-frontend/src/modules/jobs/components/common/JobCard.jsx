import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    Avatar,
    Divider,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    LocationOn,
    AttachMoney,
    AccessTime,
    Star,
    BookmarkBorder,
    Bookmark
} from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux';
import { saveJobToServer, unsaveJobFromServer, selectSavedJobs } from '../../services/jobSlice';

const JobCard = ({ job, onViewDetails }) => {
    if (!job) return null;
    
    const {
        id,
        title,
        description,
        budget,
        location,
        postedDate,
        deadline,
        category,
        skills = [],
        hirerName,
        hirerRating
    } = job;

    const dispatch = useDispatch();
    const savedJobs = useSelector(selectSavedJobs) || [];
    const isSaved = savedJobs.some(saved => saved.id === id);
    
    const handleToggleSave = () => {
        if (isSaved) {
            dispatch(unsaveJobFromServer(id));
        } else {
            dispatch(saveJobToServer(id));
        }
    };

    // Helper to format budget, handling object or primitive
    const formatBudget = () => {
        if (budget && typeof budget === 'object') {
            const { min, max, currency } = budget;
            return `${currency} ${min} - ${max}`;
        }
        return budget != null ? `$${budget}` : '';
    };

    return (
        <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                    <Tooltip title="Category" arrow>
                        <Chip 
                            size="small" 
                            label={category} 
                            color="primary" 
                            variant="outlined" 
                        />
                    </Tooltip>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description?.substring(0, 150)}
                    {description?.length > 150 ? '...' : ''}
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Budget" arrow>
                            <AttachMoney fontSize="small" color="action" sx={{ mr: 0.5 }} aria-label="Budget" />
                        </Tooltip>
                        <Typography variant="body2">
                            {formatBudget()}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Location" arrow>
                            <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} aria-label="Location" />
                        </Tooltip>
                        <Typography variant="body2">
                            {location}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Posted date" arrow>
                            <AccessTime fontSize="small" color="action" sx={{ mr: 0.5 }} aria-label="Posted date" />
                        </Tooltip>
                        <Typography variant="body2">
                            {new Date(postedDate).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Stack>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {skills.map((skill, index) => (
                        <Tooltip key={index} title={skill} arrow>
                            <Chip 
                                label={skill} 
                                size="small" 
                                variant="outlined" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                                aria-label={skill}
                            />
                        </Tooltip>
                    ))}
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }} aria-label="Hirer avatar">
                        {hirerName ? hirerName[0].toUpperCase() : 'H'}
                    </Avatar>
                    <Typography variant="body2">
                        {hirerName}
                    </Typography>
                    {hirerRating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                            <Tooltip title="Hirer rating" arrow>
                                <Star sx={{ color: 'gold', fontSize: 18, mr: 0.5 }} aria-label="Hirer rating" />
                            </Tooltip>
                            <Typography variant="body2">{hirerRating}</Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
            
            <CardActions sx={{ display: 'flex', gap: 1, flexDirection: 'column'}}>
                <Tooltip title={isSaved ? 'Unsave job' : 'Save job'} arrow>
                    <IconButton onClick={handleToggleSave} aria-label={isSaved ? 'Unsave job' : 'Save job'}>
                        {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />} 
                    </IconButton>
                </Tooltip>
                <Tooltip title="View job details" arrow>
                    <Button size="small" variant="contained" onClick={() => onViewDetails?.(id)} fullWidth aria-label="View details">
                        View Details
                    </Button>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default JobCard;