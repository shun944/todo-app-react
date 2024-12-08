import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useReset from "../../hooks/useReset";

interface PasswordResetFormProps {
  token: string | null;
}

const schema = yup.object().shape({
  password: yup.string().required('Password is required').min(6, "Password must be at least 6 characters"),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match')
})

// const PassowrdResetForm = () => {
const PassowrdResetForm: React.FC<PasswordResetFormProps> = ({ token }) => {
  const navigate = useNavigate();
  const { updatePassword } = useReset();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    if (token) {
      //#TODO: when update is failed, show error message
      const result = updatePassword({token, password: data.password});
      navigate('/', { state: { message: 'Password reset successfully' } });
    }
  }

  const handleBack = () => {
    navigate('/');
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
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
        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
        <Button variant="contained" color="inherit" onClick={handleBack}>
          Back to Login
        </Button>
      </Box>
      </form>
    </>
  )
}

export default PassowrdResetForm;