export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export type CertificateType = 'SUDANESE' | 'ARABIAN' | 'FOREIGN';

export interface RegisterFormData {
  fullNameAr: string;
  fullNameEn: string;
  dateOfBirth: string;
  phone: string;
  personalEmail: string;
  address: string;
  certificateType: CertificateType;
  nationality: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface FormFieldError {
  field: string;
  message: string;
}
