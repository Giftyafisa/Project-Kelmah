import React, { useState } from 'react';
import { Box, Button, IconButton, Badge, Menu, MenuItem, Avatar, useTheme } from '@mui/material';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useNavLinks from '../../../hooks/useNavLinks';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logoutUser } from '../../auth/services/authSlice';
import { useNotifications } from '../../notifications/contexts/NotificationContext';
import { useAuth } from '../../auth/contexts/AuthContext';

const DesktopNav = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout: contextLogout } = useAuth();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { navLinks } = useNavLinks();
  const { unreadCount } = useNotifications();
  const showAuthButtons = !isAuthenticated;
  const userRole = user?.role || user?.userType || user?.userRole;
  const hasRole = (role) => userRole === role;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    sessionStorage.setItem('dev-logout', 'true');
    dispatch(logoutUser());
    contextLogout();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {navLinks.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive: active }) => ({
            margin: '0 12px',
            color: active ? '#D4AF37' : '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '6px 10px',
            borderRadius: '4px',
            backgroundColor: active ? 'rgba(212,175,55,0.1)' : 'transparent',
            textDecoration: 'none'
          })}
          aria-label={label}
        >
          {label}
        </NavLink>
      ))}
      {!showAuthButtons ? (
        <>
          <IconButton component={RouterLink} to="/notifications" sx={{ mx: 1.5, color: '#fff' }} aria-label="Notifications">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen} sx={{ mx: 1.5, color: '#fff' }} aria-label="Account menu">
            {user?.profileImage ? (
              <Avatar src={user.profileImage} alt={user.firstName} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }} sx={{ fontSize: '1rem' }}>
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate(hasRole('worker') ? '/worker/profile' : '/profile'); }} sx={{ fontSize: '1rem' }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }} sx={{ fontSize: '1rem' }}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ fontSize: '1rem' }}>
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Button component={RouterLink} to="/login" sx={{ mx: 2, color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
            Login
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/register"
            sx={{
              mx: 2,
              backgroundColor: '#D4AF37',
              color: '#1a1a1a',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#c4942a' }
            }}
            aria-label="Register"
          >
            Register
          </Button>
        </>
      )}
    </Box>
  );
};

export default DesktopNav; 