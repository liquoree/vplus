export type AdminPublic = {
  id: string;
  login: string;
  createdAt: string;
};

export type AdminLoginCredentials = {
  login: string;
  password: string;
};

export type AdminLoginResponse = {
  admin: AdminPublic;
};

export type AdminLogoutResponse = {
  success: boolean;
};