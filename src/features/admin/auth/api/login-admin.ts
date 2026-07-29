import type {
  AdminLoginCredentials,
  AdminLoginResponse,
} from '../model/types';

type AdminLoginErrorResponse = {
  message?: unknown;
};

export class AdminLoginError
  extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name =
      'AdminLoginError';

    this.status = status;
  }
}

export async function loginAdmin(
  credentials: AdminLoginCredentials
): Promise<AdminLoginResponse> {
  const response = await fetch(
    '/api/admin/auth/login',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify(
        credentials
      ),
    }
  );

  const responseData =
    (await response
      .json()
      .catch(() => null)) as
      | AdminLoginResponse
      | AdminLoginErrorResponse
      | null;

  if (!response.ok) {
    const message =
      responseData &&
      'message' in responseData &&
      typeof responseData.message ===
        'string'
        ? responseData.message
        : 'Не удалось выполнить вход';

    throw new AdminLoginError(
      message,
      response.status
    );
  }

  return (
    responseData as AdminLoginResponse
  );
}