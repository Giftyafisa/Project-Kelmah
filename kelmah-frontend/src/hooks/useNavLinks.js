import { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../modules/auth/services/authSlice';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';

const useNavLinks = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const userRole = user?.role || user?.userType || user?.userRole;
  const hasRole = (role) => userRole === role;
  const location = useLocation();

  const navLinks = useMemo(() => {
    const links = [
      { label: 'Home', to: '/', icon: <HomeIcon /> },
      { label: 'Jobs', to: '/jobs', icon: <WorkIcon /> }
    ];

    if (!isAuthenticated || hasRole('worker')) {
      links.push({
        label: 'Find Work',
        to: isAuthenticated && hasRole('worker') ? '/worker/find-work' : '/search/location',
        icon: <SearchIcon />
      });
    }
    if (!isAuthenticated || hasRole('hirer')) {
      links.push({
        label: 'Find Talents',
        to: isAuthenticated && hasRole('hirer') ? '/hirer/find-talent' : '/find-talents',
        icon: <PeopleIcon />
      });
    }

    links.push({ label: 'Pricing', to: '/premium', icon: <StarIcon /> });
    return links;
  }, [isAuthenticated, hasRole]);

  const isActive = useCallback((path) => {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  }, [location.pathname]);

  return { navLinks, isActive };
};

export default useNavLinks; 