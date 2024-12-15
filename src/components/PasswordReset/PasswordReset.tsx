import React from "react";
import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import EmailFormForReset from "../EmailFormForReset/EmailFormForReset";
import PassowrdResetForm from "../PasswordResetForm/PasswordResetForm";
import useReset from "../../hooks/useReset";
import { useLocation, useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const navigate = useNavigate();
  const { error, emailMessage, sendEmailForReset, varifyToken, isValid } = useReset();
  const [varifiedToken, setVarifiedToken] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isTokenForReset = queryParams.has('token');
  const tokenForReset = queryParams.get('token');

  useEffect(() => {
    if (isTokenForReset && tokenForReset) {
      varifyToken(tokenForReset);
    } 
  }, [])

  useEffect(() => {
    if (isValid) {
      setVarifiedToken(true);
    } else if (isValid === false) {
      navigate('/error', { state: { errorMessage: 'Invalid or Expired token' } });
    }
  }, [isValid]);

  return (
    <Container>
      <Box mt={6}>
        {varifiedToken ? (
        <PassowrdResetForm token={tokenForReset}/>
        ) : (
        <EmailFormForReset sendEmailForReset={sendEmailForReset} emailMessage={emailMessage}/>
        )}
      </Box>
    </Container>
  );
}

export default PasswordReset;