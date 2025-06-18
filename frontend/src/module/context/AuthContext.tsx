import { useState, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  AuthContextInterface,
  UserProfileInterface,
  UserProfileSigninInterface,
} from "../interface/interface";

import { useSignin, useSignup } from "../services/hooks/auth/use-auth";
import { onErrorNotify, onSuccessNotify } from "../utils/toastNotify";

const AuthContext = createContext<AuthContextInterface>({
  isAuthenticated: false,
  user: { username: "", email: "" },
  signup: (userData: UserProfileSigninInterface) => {
    console.log(userData);
  },
  signin: (userData) => {
    console.log(userData);
  },
  logout: Function,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { mutate: signupMutate } = useSignup();
  const { mutate: signinMutate } = useSignin();

  const [user, setUser] = useState<UserProfileInterface | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signup = (userData: UserProfileSigninInterface) => {
    if (userData) {
      signupMutate(
        {
          username: userData?.username || "",
          email: userData?.email,
          password: userData?.password,
        },
        {
          onSuccess: (data) => {
            onSuccessHandler(data);
          },
          onError: (err: any) => {
            onErrorHandler(err.data?.msg || "something went wrong");
          },
        }
      );
    } else {
      onErrorHandler("Invalid user data");
    }
  };

  const signin = (userData) => {
    if (userData) {
      signinMutate(
        {
          password: userData?.password,
          email: userData?.email,
        },
        {
          onSuccess: (data) => {
            onSuccessHandler(data);
          },
          onError: (err: any) => {
            onErrorHandler(err.data?.msg || "something went wrong");
          },
        }
      );
    } else {
      onErrorHandler("Invalid user data");
    }
  };

  const onSuccessHandler = (data: any) => {
    localStorage.setItem("access_token", data?.data?.token?.access_token);
    localStorage.setItem("refresh_token", data?.data?.token?.refresh_token);
    setUser(data?.user);
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
    localStorage.removeItem("refresh_token");

    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValues: AuthContextInterface = {
    user,
    isAuthenticated,
    signup,
    signin,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
};

export { AuthProvider, useAuth };
