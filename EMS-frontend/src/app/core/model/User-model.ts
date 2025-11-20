
export interface UserProfile {
  id: string; // Or number
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}