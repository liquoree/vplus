import axios from 'axios';

import {
  apiClient,
} from '@/shared/api/client';

import type {
  AdminLoginCredentials,
  AdminLoginResponse,
} from '../model/types';

type ApiErrorResponse = {
  error?: {
    message?: string;
  };
};

export class AdminLoginError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name = 'AdminLoginError';
    this.status = status;
  }
}

export async function loginAdmin(
  credentials: AdminLoginCredentials
): Promise<AdminLoginResponse> {
  try {
    const response =
      await apiClient.post<AdminLoginResponse>(
        '/admin/auth/login',
        credentials
      );

    return response.data;
  } catch (error) {
    if (
      !axios.isAxiosError<ApiErrorResponse>(
        error
      )
    ) {
      throw new AdminLoginError(
        'Не удалось выполнить вход',
        0
      );
    }

    const status =
      error.response?.status ?? 0;

    const backendMessage =
      error.response?.data?.error
        ?.message;

    const message =
      backendMessage ??
      (status === 401
        ? 'Неверный логин или пароль'
        : 'Не удалось выполнить вход');

    throw new AdminLoginError(
      message,
      status
    );
  }
}