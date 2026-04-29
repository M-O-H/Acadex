export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}