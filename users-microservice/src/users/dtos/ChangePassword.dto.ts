export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

// Alias para compatibilidad con el API Gateway
export { ChangePasswordDto as ChangePasswordDTO };
