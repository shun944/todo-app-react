import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";

interface ErrorPageProps {
  errorMessage: string;
}

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ErrorPageProps;

  const handleBack = () => {
    navigate('/');
  }
  
  return (
    <div>
      <h1>Something went wrong!!</h1>
      <p>Error Message: {state?.errorMessage}</p>
      <Box component="form" 
        sx={{
          mt: 3, display: 'flex',
          flexDirection: 'column', mb: 3, alignItems: 'center'
        }}>
        <Button type="submit" variant="contained"
          color="inherit" onClick={handleBack} sx={{ width: '30%' }}
        >
          Back to Login
        </Button>
      </Box>
    </div>
  );
}

export default ErrorPage;