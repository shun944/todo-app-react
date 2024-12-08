import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthenticate from '../../hooks/useAuthenticate';
import './LoginForm.css';
import { useUserInfo } from '../../contexts/UserInfoContext';
import CreateUserDialog from '../CreateUserDialog/CreateUserDialog';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button, Box, Link } from '@mui/material';
import TextField from '@mui/material/TextField';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = () => {
  const [email] = useState('testmail4@example.com');
  const [password] = useState('');
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openFlash, setOpenFlash] = useState(false);
  const [flashMessage, setFlashMessage] = useState('');

  const { user, error } = useAuthenticate(loginInfo, loginAttempted);

  const navigate = useNavigate();
  const { user: userInfo, setUser } = useUserInfo();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });



  useEffect(() => {
    if (user?.token) {
      setUser(user);
      localStorage.setItem('token', user.token);
      navigate('/todos');
    } else if (error) {
      setErrorMessages([error]);
    }
  }, [user, navigate, error, setUser]);

  const handleCreate = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleOpenFlashChange = (open: boolean, message: string) => {
    setOpenFlash(open);
    setFlashMessage(message);
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

  const onSubmit = (data: any) => {
    setLoginInfo({ email: data.email, password: data.password });
    setLoginAttempted(true);
  }


  return (
    <div>
      <Snackbar
          open={openFlash}
          autoHideDuration={3000}
          onClose={handleClose}
          message={flashMessage}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SnackbarContent
            message={flashMessage}
            style={{ backgroundColor: 'green', justifyContent: 'center' }}
          />
        </Snackbar>
      {dialogOpen && (
        <div>
            <CreateUserDialog onClose={handleDialogClose}
              onOpenFlashChange={handleOpenFlashChange}
            />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Controller name="email" control={control}
            defaultValue={email} render={({ field }) => (
              <TextField {...field} id='email' label='Email'
                type="email" size='small' error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
            )}
          />
          <Controller name="password" control={control}
            defaultValue={password} render={({ field }) => (
              <TextField {...field} id='password' label='Password'
                type="password" size='small' error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary">Login</Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>Resister User</Button>
          <Link href="/reset-password" variant='body2'>Forgot password?</Link>
        </Box>
      </form>
    </div>
  );
};

export default LoginForm;