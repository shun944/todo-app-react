import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthenticate from '../../hooks/useAuthenticate';
import './LoginForm.css';
import { useUserInfo } from '../../contexts/UserInfoContext';
import CreateUserDialog from '../CreateUserDialog/CreateUserDialog';

import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';


const LoginForm = () => {
  const [email, setUsername] = useState('testmail4@example.com');
  const [password, setPassword] = useState('');
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user, error } = useAuthenticate(loginInfo, loginAttempted);

  const navigate = useNavigate();
  const { user: userInfo, setUser } = useUserInfo();


  useEffect(() => {
    if (user?.token) {
      setUser(user);
      localStorage.setItem('token', user.token);
      navigate('/test');// ログイン成功時に/testに遷移
    } else if (error) {
      setErrorMessages([error]);
    }
  }, [user, navigate, error, setUser]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    //validation
    let errorMessages: string[] = [];
    if (!email){
      errorMessages.push('Email is required');
    }
    if(!password){
      errorMessages.push('Password is required');
    }

    if (errorMessages.length > 0) {
      setErrorMessages(errorMessages);
      return;
    }

    setLoginInfo({ email, password });
    setLoginAttempted(true);
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUsername(e.target.value);

    if (e.target.value) {
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Username is required'));
    } 
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPassword(e.target.value);

    if (e.target.value) {
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Password is required'));
    } 
  };

  const handleCreate = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }


  return (
    <div>
      {dialogOpen && (
        <div>
            <CreateUserDialog onClose={handleDialogClose} />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <TextField id="email" label="Email" value={email} 
            onChange={handleEmailChange} size="small"
          />
          <Box mt={2}></Box>
          <TextField id="password" label="Password" type="password" value={password}
            onChange={handlePasswordChange} size="small" 
          />
        </div>
      </form>
      <div>
          {errorMessages && errorMessages.map((message, index) =>
            <React.Fragment key={index}>
              <p className="red">{message}</p>
            </React.Fragment>
          )}
        </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>Login</Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button variant="contained" onClick={handleCreate}>Resister User</Button>
      </Box>
    </div>
  );
};

export default LoginForm;