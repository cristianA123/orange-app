export function AuthResponse(response: any) {
  return {
    success: true,
    data: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      },
    },
  };
}
