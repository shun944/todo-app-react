import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthenticate from '../../hooks/useAuthenticate';
import './LoginForm.css';
import { useUserInfo } from '../../contexts/UserInfoContext';

import { Button, Box } from '@mui/material';
import Textarea from '@mui/joy/Textarea';

const LoginForm = () => {
  const [username, setUsername] = useState('user_with_hashpass');
  const [password, setPassword] = useState('');
  const [loginInfo, setLoginInfo] = useState({ username: '', password: '' });
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

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
    if (!username){
      errorMessages.push('Username is required');
    }
    if(!password){
      errorMessages.push('Password is required');
    }

    if (errorMessages.length > 0) {
      setErrorMessages(errorMessages);
      return;
    }

    setLoginInfo({ username, password });
    setLoginAttempted(true);
  };


  const handleUsernameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <Textarea id="username" value={username} onChange={handleUsernameChange}/>
          <label htmlFor="password">Password:</label>
          <Textarea id="password" value={password} onChange={handlePasswordChange}/>
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
    </div>
  );
};

export default LoginForm;