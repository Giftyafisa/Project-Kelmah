import React, { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Chip, TextField, CircularProgress, Box } from '@mui/material';
import { fetchJobs, selectJobs, selectJobsLoading, selectJobsError, selectJobFilters, setFilters, selectJobsPagination } from '../../jobs/services/jobSlice';

const JobSearchPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);
  const filters = useSelector(selectJobFilters);
  const { currentPage, totalPages } = useSelector(selectJobsPagination);

  useEffect(() => {
    dispatch(fetchJobs({ ...filters, page: currentPage }));
  }, [dispatch, filters, currentPage]);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const commonTextFieldStyles = {
    '& label.Mui-focused': {
      color: '#D4AF37',
    },
    '& .MuiOutlinedInput-root': {
      color: '#FFFFFF',
      '& fieldset': {
        borderColor: 'rgba(212, 175, 55, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: '#D4AF37',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#D4AF37',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#B0B0B0',
    },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
  };

  return (
    <Box p={2} sx={{ background: '#121212', color: '#FFFFFF', minHeight: 'calc(100vh - 64px)'}}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, color: '#D4AF37', fontWeight: 'bold' }}>
        Search Jobs (Basic)
      </Typography>
      <TextField
        label="Search jobs"
        variant="outlined"
        fullWidth
        value={filters.search}
        onChange={handleSearchChange}
        sx={{ ...commonTextFieldStyles, mb: 2 }}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" sx={{my: 3}}>
            <CircularProgress sx={{color: '#D4AF37'}} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{color: theme.palette.error.light /* Gold or white might be better depending on error severity display */}}>{error}</Typography>
      ) : jobs.length === 0 ? (
        <Typography sx={{color: '#B0B0B0', textAlign: 'center', mt: 3}}>No jobs found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 12px rgba(212,175,55,0.2)'
                },
                backgroundColor: '#1F1F1F',
                color: '#FFFFFF',
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{color: '#D4AF37'}}>{job.title}</Typography>
                  <Typography variant="body2" sx={{color: '#B0B0B0'}}>{job.location}</Typography>
                  <Box mt={1} mb={1}>
                    <Chip
                      label={job.category}
                      size="small"
                      sx={{ backgroundColor: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{color: '#E0E0E0'}}>{job.description.substring(0, 100)}...</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default JobSearchPage; 