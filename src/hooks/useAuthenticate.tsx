import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { User } from "../models/User";
import { useAtom } from "jotai";
import { userAtom, isUserInfoSetDoneAtom } from "../atomJotai";

interface LoginInfo {
  username: string;
  password: string;
}

const useAuthenticate = (loginInfo?: LoginInfo, loginAttempted?: boolean) => {
  const [user, setUser] = useAtom(userAtom);
  const [isUserInfoSetDone, setIsUserInfoSetDone] = useAtom(isUserInfoSetDoneAtom);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (user) {
      setIsUserInfoSetDone(true);
    }
  }, [user]);

  return { user, error, reAuthenticate };
}

export default useAuthenticate;