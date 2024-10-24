import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthenticate from '../../hooks/useAuthenticate';
import './LoginForm.css';
import { useUserInfo } from '../../contexts/UserInfoContext';

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
    //console.log(`User: ${user}, Error: ${error}`);
    if (user?.token) {
      setUser(user);
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
    console.log(`Username: ${username}, Password: ${password}`);
  };


  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);

    if (e.target.value) {
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Username is required'));
    } 
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (e.target.value) {
      setErrorMessages(prevMessages => prevMessages.filter(message => message !== 'Password is required'));
    } 
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label>
        Password:
        <input type="text" value={password} onChange={handlePasswordChange} />
      </label>
      <button type="submit">Login</button>
      {errorMessages && errorMessages.map((message, index) => 
        <p className="red" key={index}>{message}</p>)
      }
    </form>
  );
};

export default LoginForm;