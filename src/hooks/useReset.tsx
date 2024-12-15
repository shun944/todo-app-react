import { useState } from "react";
import apiClient from "../apiClient";

interface ResetResponse {
  message: string;
}

interface VarifyResponse {
  message: string;
  valid: boolean;
}

interface updatePasswwordRequest {
  token: string;
  password: string;
}

interface updatePasswordResponse {
  message: string;
}

const useReset = () => {
  const [error, setError] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const sendEmailForReset = async (email: string) => {
    try {
      const response = await apiClient.post<ResetResponse>("/password_resets", { email });
      setEmailMessage(response.data.message);
    } catch (err: any) {
      setError(err.message);
    }
  }

  const varifyToken = async (token: string) => {
    try {
      const response = await apiClient.get<VarifyResponse>(`/varify_token?token=${token}`);
      setIsValid(response.data.valid);
      //setIsValid(true); //Temporary
    } catch (err: any) {
      setError(err.message);
    }
  }

  const updatePassword = async (request: updatePasswwordRequest): Promise<string | undefined> => {
    try {
      const response = await apiClient.post<updatePasswordResponse>("/update_password", request);
      return response.data.message;
    } catch (err: any) {
      setError(err.message);
      return undefined;
    }
  }

  return { error, emailMessage, sendEmailForReset, varifyToken, isValid, updatePassword };
}

export default useReset;