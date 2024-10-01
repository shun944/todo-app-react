import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../models/User';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserInfoContext = createContext<UserContextType | null>(null);

interface UserInfoProviderProps {
  children: ReactNode;
}

export const UserInfoProvider = ({ children }: UserInfoProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserInfoContext.Provider value={{ user, setUser }}>
      {children}
    </UserInfoContext.Provider>
  );
};

//ユーザ情報を取得するためのカスタムフック
export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (context === null) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
}