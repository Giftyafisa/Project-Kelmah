import React, { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, useTheme, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useNavLinks from '../../../hooks/useNavLinks';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logoutUser } from '../../auth/services/authSlice';
import { useNotifications } from '../../notifications/contexts/NotificationContext';

const MobileNav = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { navLinks } = useNavLinks();
  const { unreadCount } = useNotifications();
  const showAuthButtons = !isAuthenticated;
  const userRole = user?.role || user?.userType || user?.userRole;
  const hasRole = (role) => userRole === role;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    sessionStorage.setItem('dev-logout', 'true');
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: '#fff', mr: 1 }} aria-label="Open menu">
        <MenuIcon fontSize="large" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { backgroundColor: '#1a1a1a', color: '#fff', minWidth: 200 } }}
      >
        {navLinks.map(({ label, to }) => (
          <MenuItem
            key={to}
            onClick={() => handleNavigate(to)}
            sx={{ fontSize: '1rem', py: 1, color: '#fff' }}
            aria-label={label}
          >
            {label}
          </MenuItem>
        ))}
        {showAuthButtons ? (
          <>
            <MenuItem onClick={() => handleNavigate('/login')} sx={{ fontSize: '1rem', py: 1, color: '#fff' }} aria-label="Login">Login</MenuItem>
            <MenuItem onClick={() => handleNavigate('/register')} sx={{ fontSize: '1rem', py: 1, color: '#fff' }} aria-label="Register">Register</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleNavigate('/notifications')} sx={{ fontSize: '1rem', py: 1, color: '#fff' }} aria-label="Notifications">
              <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
                <NotificationsIcon sx={{ color: '#D4AF37' }} />
              </Badge>
              Notifications
            </MenuItem>
            <Divider sx={{ backgroundColor: '#444' }} />
            <MenuItem onClick={() => handleNavigate('/dashboard')} sx={{ fontSize: '1rem', py: 1, color: '#fff' }} aria-label="Dashboard">Dashboard</MenuItem>
            <MenuItem onClick={() => handleNavigate(hasRole('worker') ? '/worker/profile' : '/profile')} sx={{ fontSize: '1rem', py: 1, color: '#fff' }} aria-label="Profile">Profile</MenuItem>
            <MenuItem onClick={() => handleNavigate('/settings')} sx={{ fontSize: '1rem', py: 1, color: '#fff' }} aria-label="Settings">Settings</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ fontSize: '1rem', py: 1, color: '#fff' }} aria-label="Logout">Logout</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default MobileNav; 