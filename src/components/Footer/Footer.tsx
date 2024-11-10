import React from 'react';
import './Footer.css';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    // <footer className='footer'>
    //   <h1>Footer</h1>
    // </footer>
    <Box component="footer" sx={{ p: 3, backgroundColor: 'lightgray' }}>
      <Typography variant="body1" align="center">
        ©︎2024 Shun Yamamoto All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;