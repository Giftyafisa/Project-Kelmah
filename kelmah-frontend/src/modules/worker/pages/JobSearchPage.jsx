import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
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
import HomeIcon from '@mui/icons-material/Home';
import {
  Breadcrumbs,
  Link,
  Typography,
  Grow,
  Container
} from '@mui/material';
import { RouterLink } from 'react-router-dom';

const JobSearchPage = () => {
  const theme = useTheme();

  // ... existing code ...

  return (
    // ... existing code ...

    <Chip 
      label={job.type} 
      size="small" 
      sx={{ mr: 1, backgroundColor: job.type === 'Contract' ? theme.palette.info.light : theme.palette.success.light }}
    />

    // ... existing code ...

    <Grow in timeout={500}>
      <Container sx={{ py: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/worker/dashboard" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon fontSize="small" sx={{ mr: 0.5 }} />
            Find Work
          </Typography>
        </Breadcrumbs>
      </Container>
    </Grow>
  );
};

export default JobSearchPage; 