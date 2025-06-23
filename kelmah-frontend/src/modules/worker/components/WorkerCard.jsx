import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActionArea, 
  Typography, 
  Box, 
  Chip, 
  Divider, 
  Stack, 
  Grid, 
  Avatar, 
  Rating,
  CardActions,
  Button
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  WorkOutline as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate();

  // Handle click on card
  const handleClick = () => {
    navigate(`/workers/${worker.id}`);
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        border: '1px solid #D4AF37',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={worker.profileImage} 
              alt={worker.name} 
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="h5" component="h2" noWrap sx={{ color: '#fff', fontWeight: 'bold' }}>
                {worker.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#ddd', fontSize: '0.95rem' }} noWrap>
                {worker.title || 'Freelancer'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Rating 
                  value={worker.rating || 0} 
                  precision={0.5} 
                  size="small" 
                  readOnly 
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <Typography variant="caption" sx={{ color: '#ddd', ml: 0.5 }}>
                  ({worker.reviewCount || 0})
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ 
            minHeight: '3em',
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
            color: '#ccc',
            fontSize: '0.9rem'
          }}>
            {worker.bio || 'No bio provided'}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            {worker.skills?.slice(0, 3).map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="medium"
                variant="outlined"
                sx={{ borderColor: '#D4AF37', color: '#fff' }}
              />
            ))}
            {worker.skills?.length > 3 && (
              <Chip
                label={`+${worker.skills.length - 3}`}
                size="medium"
                variant="outlined"
              />
            )}
          </Stack>

          <Divider sx={{ my: 1, borderColor: '#444' }} />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5, color: '#D4AF37' }} />
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                  ${worker.hourlyRate || '--'}/hr
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon fontSize="small" sx={{ mr: 0.5, color: '#D4AF37' }} />
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  {worker.jobSuccess ? `${worker.jobSuccess}% Success` : 'New Worker'}
                </Typography>
              </Box>
            </Grid>
            {worker.location && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5, color: '#D4AF37' }} />
                  <Typography variant="body1" sx={{ color: '#fff' }} noWrap>
                    {worker.location}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ p: 2 }}>
        <Button
          size="medium"
          variant="contained"
          startIcon={<InfoIcon />}
          onClick={handleClick}
          fullWidth
          sx={{
            backgroundColor: '#D4AF37',
            color: '#1a1a1a',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#c4942a' }
          }}
        >
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};

WorkerCard.propTypes = {
  worker: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    title: PropTypes.string,
    bio: PropTypes.string,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    hourlyRate: PropTypes.number,
    jobSuccess: PropTypes.number,
    location: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default WorkerCard; 