export interface UserProfileLoginInterface {
  username: string;
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
  login: (userData: UserProfileLoginInterface) => void;
  logout: () => void;
}
