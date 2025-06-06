export interface UserProfileInterface {
  username: string;
  email: string;
}

export interface AuthContextInterface {
  user: UserProfileInterface | null;
  isAuthenticated: boolean;
  login: (userData: UserProfileInterface) => void;
  logout: () => void;
}
