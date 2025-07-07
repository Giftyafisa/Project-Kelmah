// Initial JobApplicationPage file

import React, { useState, useEffect } from 'react';
import Grow from '@mui/material/Grow';
import {
  Container,
  Breadcrumbs,
  Link,
  Typography, 
  Grid, 
  Paper, 
  Box,
  TextField,
  Button,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Skeleton,
  useTheme
} from '@mui/material';
import jobsApi from '../../jobs/services/jobsApi';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  FilterList as FilterListIcon,
  WorkOutline as WorkOutlineIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const JobApplicationPage = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('recent');

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = { page, limit: jobsPerPage };
        if (searchTerm) params.search = searchTerm;
        if (location) params.location = location;
        if (category) params.category = category;
        if (jobType) params.type = jobType;
        // Map sortBy to API sort parameter
        switch (sortBy) {
      case 'salary-high':
            params.sort = '-budget';
            break;
      case 'salary-low':
            params.sort = 'budget';
            break;
      case 'recent':
            params.sort = '-createdAt';
            break;
          // 'relevant' not directly supported by API
      default:
            break;
        }
        const response = await jobsApi.getJobs(params);
        const { data, meta } = response;
        setJobs(data);
        setTotalPages(meta.pagination.totalPages);
        setTotalItems(meta.pagination.totalItems);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchTerm, location, category, jobType, page, sortBy]);

  const currentJobs = jobs;

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // add handlers for sorting and clearing filters
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };
  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setCategory('');
    setJobType('');
    setPage(1);
  };

  const commonTextFieldStyles = {
    '& label.Mui-focused': {
      color: '#D4AF37', // Gold
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#D4AF37', // Gold
    },
    '& .MuiOutlinedInput-root': {
      color: '#FFFFFF', // White input text
      '& fieldset': {
        borderColor: 'rgba(212, 175, 55, 0.3)', // Gold border
      },
      '&:hover fieldset': {
        borderColor: '#D4AF37', // Gold
      },
      '&.Mui-focused fieldset': {
        borderColor: '#D4AF37', // Gold
      },
      '& .MuiSvgIcon-root': {
        color: '#D4AF37', // Gold for icons in input
      }
    },
    '& .MuiInputLabel-root': {
      color: '#B0B0B0', // Light grey for label
    },
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slight background tint for text fields
    borderRadius: 1,
  };

  const commonSelectStyles = {
    color: '#FFFFFF',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D4AF37',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D4AF37',
    },
    '& .MuiSvgIcon-root': { // Dropdown arrow
      color: '#D4AF37',
    },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
  };

  const menuItemStyles = {
    backgroundColor: '#1F1F1F', // Dark background for menu items
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: 'rgba(212, 175, 55, 0.1)', // Gold tint on hover
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(212, 175, 55, 0.2)', // More prominent gold tint for selected
      '&:hover': {
        backgroundColor: 'rgba(212, 175, 55, 0.3)',
      }
    }
  };


  return (
    <Grow in timeout={500}>
      <Container sx={{ py: 4, background: '#121212', color: '#FFFFFF', minHeight: 'calc(100vh - 64px)'}}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, '& .MuiLink-root': { color: '#D4AF37' }, '& .MuiTypography-root': { color: '#B0B0B0'} }}>
          <Link component={RouterLink} to="/worker/dashboard" underline="hover">
            Dashboard
          </Link>
          <Typography>Find Work</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, color: '#D4AF37', fontWeight: 'bold' }}>
          Find Work Opportunities
        </Typography>
        
        {/* Search and Filter Section */}
        <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Jobs (e.g. Carpenter, Plumber)"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#D4AF37' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={commonTextFieldStyles}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Location (e.g. Accra, Kumasi)"
                  variant="outlined"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ color: '#D4AF37' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={commonTextFieldStyles}
                />
            </Grid>
            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputLabel-root': { color: '#B0B0B0' } }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={commonSelectStyles}
                  MenuProps={{ PaperProps: { sx: { backgroundColor: '#1F1F1F' } } }}
                >
                  <MenuItem value="" sx={menuItemStyles}>All Categories</MenuItem>
                  <MenuItem value="Plumbing" sx={menuItemStyles}>Plumbing</MenuItem>
                  <MenuItem value="Carpentry" sx={menuItemStyles}>Carpentry</MenuItem>
                  <MenuItem value="Electrical" sx={menuItemStyles}>Electrical</MenuItem>
                  <MenuItem value="HVAC" sx={menuItemStyles}>HVAC</MenuItem>
                  <MenuItem value="Construction" sx={menuItemStyles}>Construction</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.5}>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputLabel-root': { color: '#B0B0B0' } }}>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={jobType}
                  label="Job Type"
                  onChange={(e) => setJobType(e.target.value)}
                  sx={commonSelectStyles}
                  MenuProps={{ PaperProps: { sx: { backgroundColor: '#1F1F1F' } } }}
                >
                  <MenuItem value="" sx={menuItemStyles}>All Types</MenuItem>
                  <MenuItem value="Contract" sx={menuItemStyles}>Contract</MenuItem>
                  <MenuItem value="Full-time" sx={menuItemStyles}>Full-time</MenuItem>
                  <MenuItem value="Part-time" sx={menuItemStyles}>Part-time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Clear all filters button and Sort By */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{
              color: '#D4AF37',
              borderColor: 'rgba(212, 175, 55, 0.5)',
              '&:hover': {
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)'
              }
            }}
          >
            Clear Filters
          </Button>
          <FormControl sx={{ minWidth: 180 }} size="small" variant="outlined">
            <InputLabel sx={{ color: '#B0B0B0' }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              sx={commonSelectStyles}
              MenuProps={{ PaperProps: { sx: { backgroundColor: '#1F1F1F' } } }}
            >
              <MenuItem value="recent" sx={menuItemStyles}>Most Recent</MenuItem>
              <MenuItem value="relevant" sx={menuItemStyles}>Most Relevant</MenuItem>
              <MenuItem value="salary-high" sx={menuItemStyles}>Highest Salary</MenuItem>
              <MenuItem value="salary-low" sx={menuItemStyles}>Lowest Salary</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Results Section */}
        {loading ? (
          <Grid container spacing={3} sx={{ p: 2 }}>
            {Array.from({ length: jobsPerPage }).map((_, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card sx={{ mb: 3, borderRadius: 2, backgroundColor: '#1F1F1F' }}>
                  <CardContent>
                    <Skeleton variant="text" width="40%" height={30} sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}/>
                    <Skeleton variant="rectangular" height={150} sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  </CardContent>
                  <Divider sx={{ borderColor: 'rgba(212,175,55,0.2)' }}/>
                  <CardActions>
                    <Skeleton variant="rectangular" height={36} width="30%" sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}/>
                    <Skeleton variant="rectangular" height={36} width="30%" sx={{ ml: 'auto', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ color: '#E0E0E0' }}>
                {totalItems} jobs found
              </Typography>
              {/* Sort By moved above */}
            </Box>
                
            {jobs.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2 }}>
                <WorkOutlineIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
                <Typography variant="h6" sx={{color: '#E0E0E0'}}>No jobs found matching your criteria</Typography>
                <Typography sx={{color: '#B0B0B0'}}>
                  Try adjusting your search filters or search term.
                </Typography>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {jobs.map((job) => (
                    <Grid item xs={12} md={6} key={job._id || job.id}> {/* Changed sm to md for better layout on medium screens */}
                      <Card
                        sx={{
                          mb: 3,
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(212,175,55,0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': { boxShadow: '0 8px 20px rgba(212,175,55,0.25)', transform: 'translateY(-4px)' },
                          backgroundColor: '#1F1F1F',
                          color: '#FFFFFF'
                        }}
                      >
                        <CardContent sx={{pb:1}}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{flexGrow: 1}}>
                              <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                                {job.title}
                              </Typography>
                              <Stack direction="column" spacing={1} sx={{ mb: 2 }}> {/* Changed to column for better readability */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <BusinessIcon fontSize="small" sx={{ mr: 1, color: '#B0B0B0' }} />
                                  <Typography variant="body2" sx={{color: '#E0E0E0'}}>
                                    {job.company || 'N/A'}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LocationIcon fontSize="small" sx={{ mr: 1, color: '#B0B0B0' }} />
                                  <Typography variant="body2" sx={{color: '#E0E0E0'}}>
                                    {job.location  || 'N/A'}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <MoneyIcon fontSize="small" sx={{ mr: 1, color: '#B0B0B0' }} />
                                  <Typography variant="body2" sx={{color: '#E0E0E0'}}>
                                    {job.salary || 'Not Disclosed'}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#B0B0B0' }} />
                                  <Typography variant="body2" sx={{color: '#E0E0E0'}}>
                                    Posted: {new Date(job.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                            <IconButton onClick={() => handleSaveJob(job._id || job.id)} sx={{color: savedJobs.includes(job._id || job.id) ? '#D4AF37' : '#B0B0B0'}}>
                              {savedJobs.includes(job._id || job.id) ? (
                                <BookmarkIcon />
                              ) : (
                                <BookmarkBorderIcon />
                              )}
                            </IconButton>
                          </Box>
                          <Typography variant="body2" paragraph sx={{ color: '#E0E0E0', maxHeight: 80, overflow: 'hidden', textOverflow: 'ellipsis', mb: 2 }}>
                            {job.description}
                          </Typography>
                          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                              label={job.type} 
                              size="small" 
                              sx={{
                                backgroundColor: job.type === 'Contract' ? 'rgba(212,175,55,0.8)' : 'rgba(255,255,255,0.2)',
                                color: job.type === 'Contract' ? '#000000' : '#FFFFFF',
                                fontWeight: 'medium'
                              }}
                            />
                            <Chip 
                              label={job.category} 
                              size="small" 
                              sx={{ color: '#D4AF37', borderColor: '#D4AF37' }}
                              variant="outlined"
                            />
                            {job.skills.map((skill) => (
                              <Chip
                                key={skill} 
                                label={skill} 
                                size="small" 
                                sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#E0E0E0' }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                        <Divider sx={{ borderColor: 'rgba(212,175,55,0.2)' }}/>
                        <CardActions sx={{ justifyContent: 'flex-end', p:2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            component={RouterLink}
                            to={`/jobs/${job._id || job.id}`}
                            sx={{
                              color: '#D4AF37',
                              borderColor: 'rgba(212,175,55,0.5)',
                              '&:hover': { borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)'}
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            component={RouterLink}
                            to={`/jobs/${job._id || job.id}?apply=true`}
                            sx={{
                              backgroundColor: '#D4AF37',
                              color: '#000000',
                              '&:hover': { backgroundColor: '#BF953F'}
                            }}
                          >
                            Apply Now
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handleChangePage} 
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#B0B0B0',
                      },
                      '& .Mui-selected': {
                        backgroundColor: 'rgba(212,175,55,0.2)',
                        color: '#D4AF37',
                        fontWeight: 'bold',
                        '&:hover': {
                           backgroundColor: 'rgba(212,175,55,0.3)',
                        }
                      },
                       '& .MuiPaginationItem-ellipsis': {
                         color: '#B0B0B0',
                       }
                    }}
                  />
              </Box>
              </>
            )}
          </>
        )}
      </Container>
    </Grow>
  );
};

export default JobApplicationPage;
