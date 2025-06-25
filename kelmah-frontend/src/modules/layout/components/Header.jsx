import React from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useVoiceAssistant } from '../../common/contexts/VoiceAssistantContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enabled, toggle } = useVoiceAssistant();
  
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.secondary.main,
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
            color: 'black',
            mr: 2 
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1.5rem',
              color: 'black',
              letterSpacing: '0.05em'
            }}
          >
            Kelmah
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Voice assist toggle for accessibility */}
        <IconButton onClick={toggle} sx={{ color: theme.palette.primary.contrastText, mr: 1 }}>
          {enabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
        {!isMobile ? <DesktopNav /> : <MobileNav />}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 



