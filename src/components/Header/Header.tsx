import React from 'react';
import './Header.css';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;