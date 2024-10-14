import React from "react";
import { useEffect } from "react";
import './CreateUserDialog.css';

import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';

import useAuthenticate from "../../hooks/useAuthenticate";
interface CreateUserDialogProps {
  onClose: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({onClose}) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [errorColumns, setErrorColumns] = React.useState<string[]>([]);

  const { user, error, registerErrorMessages, isUserCreated, registerUser, validateResisterInfo } = useAuthenticate();

  useEffect(() => {
    setErrorColumns(registerErrorMessages.map((message) => message.columnName));
  }, [registerErrorMessages]);

  useEffect(() => {
    if (isUserCreated) {
      onClose();
    }
  }, [isUserCreated]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUsername(e.target.value);
    if (errorColumns.includes('username')) {
      validateResisterInfo({username: e.target.value, email, password, passwordConfirm});
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorColumns.includes('email')) {
      validateResisterInfo({username, email: e.target.value, password, passwordConfirm});
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorColumns.includes('password')) {
      validateResisterInfo({username, email, password: e.target.value, passwordConfirm});
    }
  }

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    if (errorColumns.includes('passwordConfirm')) {
      validateResisterInfo({username, email, password, passwordConfirm: e.target.value});
    }
  }

  const onCreate = () => {
    registerUser({username, email, password, passwordConfirm});
  }

  return (
    <div className="dialog-user">
      <div className="dialog-content-user">
        <TextField id="username" label="Username" value={username} 
          onChange={handleUsernameChange} size="small"
          error={errorColumns.includes('username')}
        />
        <Box mt={1}></Box>
        <TextField id="email" label="Email" value={email}
          onChange={handleEmailChange} size="small"
          error={errorColumns.includes('email')}
        />
        <Box mt={2}></Box>
        <TextField id="password" label="Password" type="password" value={password}
          onChange={handlePasswordChange} size="small"
          error={errorColumns.includes('password')}  
        />
        <Box mt={1}></Box>
        <TextField id="password-confirm" label="Password confirmation" type="password" value={passwordConfirm}
          onChange={handlePasswordConfirmChange} size="small"
          error={errorColumns.includes('passwordConfirm')}
        />
        {registerErrorMessages && registerErrorMessages.map((message, index) => (
          <div className="error-message" key={index}>{message.message}</div>
        ))}
        <Box mt={4}></Box>
        <Box display="flex" justifyContent="flex-end">
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button variant="contained" onClick={onCreate}>Submit</Button>
          </Box>
          <Button variant="contained" onClick={onClose} color='inherit'>Close</Button>
        </Box>
      </div>
    </div>
  );
}

export default CreateUserDialog;