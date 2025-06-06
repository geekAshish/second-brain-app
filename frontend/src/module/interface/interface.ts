export interface UserProfileSigninInterface {
  username?: string;
  email: string;
  password: string;
}

export interface UserProfileInterface {
  username: string;
  email: string;
}

export interface AuthContextInterface {
  user: UserProfileInterface | null;
  isAuthenticated: boolean;
  signup: (userData: UserProfileSigninInterface) => void;
  signin: (userData: UserProfileSigninInterface) => void;
  logout: () => void;
}
