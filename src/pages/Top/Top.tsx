import React from "react";
//import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from "../../components/LoginForm/LoginForm";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import { useEffect } from "react";

export const Top= () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);
  return (
    <div>
      <Box mt={6}></Box>
      <LoginForm />
      <Box mt={6}></Box>
    </div>
  );
};