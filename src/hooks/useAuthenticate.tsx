import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { User } from "../models/User";

interface LoginInfo {
  username: string;
  password: string;
}

const useAuthenticate = (loginInfo: LoginInfo, loginAttempted: boolean) => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        if (!loginAttempted){
          return { user: null, error: null };
        }
        const response = await apiClient.post<User>("/login", loginInfo);
        setUser(response.data);
        console.log(response.data);
        
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

  //console.log(`User: ${user}, Error: ${error}`);
  return { user, error };
}

export default useAuthenticate;