import { useState, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  AuthContextInterface,
  UserProfileInterface,
  UserProfileLoginInterface,
} from "../interface/interface";

import { useSignup } from "../services/hooks/auth/use-auth";
import { onErrorNotify, onSuccessNotify } from "../utils/toastNotify";

const AuthContext = createContext<AuthContextInterface>({
  isAuthenticated: false,
  user: { username: "", email: "" },
  login: (userData: UserProfileLoginInterface) => {
    console.log(userData);
  },
  logout: Function,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { mutate } = useSignup();

  const [user, setUser] = useState<UserProfileInterface | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData: UserProfileLoginInterface) => {
    if (userData) {
      mutate(
        {
          username: userData?.username,
          email: userData?.email,
          password: userData?.password,
        },
        {
          onSuccess: (data) => {
            onSuccessHandler(data);
          },
          onError: (err: any) => {
            onErrorHandler(err?.response.data?.msg);
          },
        }
      );
    } else {
      onErrorHandler("Invalid user data");
    }
  };

  const onSuccessHandler = (data: any) => {
    localStorage.setItem("access_token", data?.access_token);
    setUser(data);
    setIsAuthenticated(true);

    onSuccessNotify("Signin Successful");

    setTimeout(() => {
      navigate("/dashboard");
    }, 400);
  };

  const onErrorHandler = (err: string) => {
    onErrorNotify(err);
  };

  const logout = () => {
    localStorage.removeItem("access_token");

    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValues: AuthContextInterface = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
