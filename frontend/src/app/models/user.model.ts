export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
