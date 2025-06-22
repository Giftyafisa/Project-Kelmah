import React from 'react';
import { useTheme, Grow, Container, Breadcrumbs, Typography, Link, Paper, Grid, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const JobSearchPage = () => {
  const theme = useTheme();
  const loading = false;
  const clearFilters = () => {};

  // ... existing code ...

  return (
    <Grow in timeout={500}>
      <Container sx={{ py: 4 }}>
        {/* Step 1: Enter Your Search Criteria */}
        <Typography variant="h6" align="center" sx={{ mb: 2, color: theme.palette.secondary.main, fontWeight: 600 }}>
          <SearchIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Step 1: Enter Your Search Criteria
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/worker/dashboard" underline="hover" color="inherit">
            Dashboard
          </Link>
          <Typography color="text.primary">Find Work</Typography>
        </Breadcrumbs>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Find Work
        </Typography>
        
        {/* Search and Filter Section */}
        <Typography variant="h6" align="center" sx={{ mb: 2, color: theme.palette.secondary.main, fontWeight: 600 }}>
          <FilterListIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Step 2: Set Filters & Search
        </Typography>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            {/* ... existing filter grid items ... */}
          </Grid>
          {/* Step 2: Review Filters & Search */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => window.scrollTo(0, document.body.scrollHeight)}
              sx={{ fontSize: '1.25rem', px: 4 }}
            >
              Search Jobs
            </Button>
          </Box>
        </Paper>

        {/* Clear all filters button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="outlined" color="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
        {/* Step 3: Browse and Select a Job */}
        <Typography variant="h6" align="center" sx={{ mb: 2, color: theme.palette.secondary.main, fontWeight: 600 }}>
          <WorkOutlineIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Step 3: Browse & Select a Job
        </Typography>

        {/* Results Section */}
        {loading ? (
          // ... existing loading skeleton ...
        ) : (
          // ... existing results section ...
        )}
      </Container>
    </Grow>
  );
};

export default JobSearchPage; 