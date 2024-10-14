import React, { useEffect } from 'react';
import './Header.css';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isLoggedinAtom } from '../../atomJotai';
import { useAtom } from 'jotai';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedinAtom);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          {isLoggedIn && (
          <Box display="flex" justifyContent="flex-end" sx={{ flexGrow: 1 }}>
            <Button variant="contained" color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
          )} 
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;