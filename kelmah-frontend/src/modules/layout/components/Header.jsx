import React from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: '#1a1a1a',
        color: '#fff',
        borderBottom: '2px solid #D4AF37',
        ...(import.meta.env.DEV && {
          '&::after': {
            content: '"DEV MODE"',
            position: 'absolute',
            top: '5px',
            right: '5px',
            fontSize: '10px',
            padding: '2px 5px',
            background: theme.palette.error.main,
            color: 'white',
            borderRadius: '2px',
          }
        })
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box 
          component={RouterLink} 
          to="/" 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#D4AF37',
            mr: 3
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1.75rem',
              color: '#D4AF37',
              letterSpacing: '0.1em'
            }}
            aria-label="Kelmah home"
          >
            Kelmah
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {!isMobile ? <DesktopNav sx={{ color: '#fff' }} /> : <MobileNav />}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 



