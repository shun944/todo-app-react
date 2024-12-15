import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, TextField } from "@mui/material";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

interface EmailFormForResetProps {
  sendEmailForReset: (email: string) => void;
  emailMessage: string | null;
}

const EmailFormForReset: React.FC<EmailFormForResetProps> = ({ sendEmailForReset, emailMessage }) => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [resultMessage, setResultMessage] = React.useState<String | null>(null);
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [openFlash, setOpenFlash] = React.useState(false);

  useEffect(() => {
    if (emailMessage) {
      setResultMessage(emailMessage);
      setIsEmailSent(true);
      setOpenFlash(true);
    }
  }, [emailMessage]);

  const onSubmit = (data: any) => {
    sendEmailForReset(data.email);
  }

  const handleBack = () => {
    navigate('/');
  }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenFlash(false);
  };

  return (
    <>
      <Snackbar
        open={openFlash}
        autoHideDuration={6000}
        onClose={handleClose}
        message={resultMessage || ''}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          message={resultMessage}
          style={{ backgroundColor: 'green', justifyContent: 'center' }}
        />
      </Snackbar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Controller name="email" control={control}
            defaultValue="" render={({ field}) => (
              <TextField {...field} id="email" label="Email"
                type="email" size="small" error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" disabled={isEmailSent}>
            Submit
          </Button>
          <Button type="submit" variant="contained" color="inherit" onClick={handleBack}>
            Back to Login
          </Button>
        </Box>
      </form>
    </>
  )
}

export default EmailFormForReset;