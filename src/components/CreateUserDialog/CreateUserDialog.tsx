import React from "react";
import { useEffect } from "react";
import './CreateUserDialog.css';
import useAuthenticate from "../../hooks/useAuthenticate";

import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface CreateUserDialogProps {
  onClose: () => void;
  onOpenFlashChange: (open: boolean, message: string) => void;
}

interface formValues {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, "Password must be at least 6 characters"),
  passwordConfirm: yup.string().required('Password Confirmation is required').oneOf([yup.ref('password')], 'Passwords must match')
})

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({onClose, onOpenFlashChange}) => {
  const { user, error, isUserCreated, registerUser } = useAuthenticate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isUserCreated) {
      onOpenFlashChange(true, 'User created successfully');
      onClose();
    }
  }, [isUserCreated]);

  const onSubmit = (data: formValues) => {
    registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm
    });
  }

  return (
    <div className="dialog-user">
      <div className="dialog-content-user">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Controller name="username" control={control} 
              defaultValue="" render={({ field }) => (
                <TextField {...field} id="username" label="Username"
                  type="username" size="small" error={!!errors.username}
                  helperText={errors.username ? errors.username.message : ''}
                />
              )}
            />
            <Controller name="email" control={control} 
              defaultValue="" render={({ field }) => (
                <TextField {...field} id="email" label="Email"
                  type="email" size="small" error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ''}
                />
              )}
            />
            <Controller name="password" control={control} 
              defaultValue="" render={({ field }) => (
                <TextField {...field} id="password" label="Password"
                  type="password" size="small" error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ''}
                />
              )}
            />
            <Controller name="passwordConfirm" control={control} 
              defaultValue="" render={({ field }) => (
                <TextField {...field} id="password-confirm" label="Password confirmation"
                  type="password" size="small" error={!!errors.passwordConfirm}
                  helperText={errors.passwordConfirm ? errors.passwordConfirm.message : ''}
                />
              )}
            />
            <Box mt={2}></Box>
            <Box display="flex" justifyContent="flex-end">
              <Box display="flex" justifyContent="space-between" width="100%">
                <Button type="submit" variant="contained" color="primary">Submit</Button>
              </Box>
                <Button variant="contained" onClick={onClose} color='inherit'>Close</Button>
            </Box>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default CreateUserDialog;