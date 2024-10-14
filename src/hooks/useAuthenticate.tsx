import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { User } from "../models/User";
import { useAtom } from "jotai";
import { userAtom, isUserInfoSetDoneAtom } from "../atomJotai";

interface LoginInfo {
  email: string;
  password: string;
}

interface RegisterInfo {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface ErrorMessage {
  columnName: string;
  message: string;
}

const useAuthenticate = (loginInfo?: LoginInfo, loginAttempted?: boolean) => {
  const [user, setUser] = useAtom(userAtom);
  const [isUserInfoSetDone, setIsUserInfoSetDone] = useAtom(isUserInfoSetDoneAtom);
  const [error, setError] = useState<string | null>(null);
  const [registerErrorMessages, setRegisterErrorMessages] = useState<ErrorMessage[]>([]);
  const [isUserCreated, setIsUserCreated] = useState<boolean>(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        if (!loginAttempted){
          return { user: null, error: null };
        }
        const response = await apiClient.post<User>("/login", loginInfo);
        setUser(response.data);
        
        if (response.data.error){
          setError(response.data.error);
        } else {
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    authenticate();
  }, [loginInfo]); // loginInfoが変更されたときに再度認証を行う

  useEffect(() => {
    if (user) {
      setIsUserInfoSetDone(true);
    }
  }, [user]);

  const validateResisterInfo = (registerInfo: RegisterInfo) => {
    setRegisterErrorMessages([]);
    const errorMessages: ErrorMessage[] = [];

    // username
    if (!registerInfo.username) {
      errorMessages.push({ columnName: 'username', message: 'Username is required' });
    }
    //email
    if (!registerInfo.email) {
      errorMessages.push({ columnName: 'email', message: 'Email is required' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerInfo.email)) {
        errorMessages.push({ columnName: 'email', message: 'Email format is invalid' });
      }
    }
    //password
    if (!registerInfo.password) {
      errorMessages.push({ columnName: 'password', message: 'Password is required' });
    } else if (registerInfo.password.length < 6) {
      errorMessages.push({ columnName: 'password', message: 'Password must be at least 6 characters' });
    }
    if (registerInfo.password && (registerInfo.password !== registerInfo.passwordConfirm)) {
      errorMessages.push({ columnName: 'password', message: 'Password and Confirm Password do not match' });
      errorMessages.push({ columnName: 'passwordConfirm', message: '' });
    }

    setRegisterErrorMessages(errorMessages);

    return errorMessages.length;
  }

  const reAuthenticate = async (token: String) => {
    
    try {
      const response = await apiClient.get<User>("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        await new Promise<void>((resolve) => {
          setUser(response.data);
          resolve();
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  const registerUser = async (request: RegisterInfo) => {
    try {
      setIsUserCreated(false);
      const errorNum = validateResisterInfo(request);
      if (errorNum > 0) {
        return;
      }
      const response = await apiClient.post<User>("/users", request);
      setUser(response.data);
      setIsUserCreated(true);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return { user, error, registerErrorMessages, isUserCreated, reAuthenticate, registerUser, validateResisterInfo};
}

export default useAuthenticate;