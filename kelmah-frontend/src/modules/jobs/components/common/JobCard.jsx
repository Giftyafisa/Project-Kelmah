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
    IconButton
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    WorkOutline as WorkIcon,
    TrendingUp as TrendingUpIcon,
    Opacity as PlumbingIcon,
    FlashOn as ElectricalIcon,
    AcUnit as HVACIcon,
    HomeWork as ConstructionIcon,
    Category as DefaultCategoryIcon,
    AttachMoney as AttachMoneyIcon,
    Star as StarIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { saveJobToServer, unsaveJobFromServer, selectSavedJobs } from '../../services/jobSlice';
import { useVoiceAssistant } from '../../common/contexts/VoiceAssistantContext';

const categoryIcons = {
    Plumbing: <PlumbingIcon fontSize="small" />,
    Carpentry: <ConstructionIcon fontSize="small" />,
    Electrical: <ElectricalIcon fontSize="small" />,
    HVAC: <HVACIcon fontSize="small" />,
    Construction: <ConstructionIcon fontSize="small" />,
    Marketing: <TrendingUpIcon fontSize="small" />
};

const JobCard = ({ job, onViewDetails }) => {
    const { speak, enabled } = useVoiceAssistant();
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
                    <Chip
                        icon={categoryIcons[category] || <DefaultCategoryIcon fontSize="small" />}
                        label={category}
                        size="small"
                        variant="outlined"
                    />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description?.substring(0, 150)}
                    {description?.length > 150 ? '...' : ''}
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                            {formatBudget()}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                            {location}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                            {new Date(postedDate).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Stack>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {skills.map((skill, index) => (
                        <Chip 
                            key={index} 
                            label={skill} 
                            size="small" 
                            variant="outlined" 
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    ))}
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {hirerName ? hirerName[0].toUpperCase() : 'H'}
                    </Avatar>
                    <Typography variant="body2">
                        {hirerName}
                    </Typography>
                    {hirerRating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                            <StarIcon sx={{ color: 'gold', fontSize: 18, mr: 0.5 }} />
                            <Typography variant="body2">{hirerRating}</Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
            
            <CardActions>
                <IconButton onClick={handleToggleSave}> 
                    {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />} 
                </IconButton>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => { if(enabled) speak(`Viewing details for ${title}`); onViewDetails?.(id); }}
                    fullWidth
                >
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
};

export default JobCard;