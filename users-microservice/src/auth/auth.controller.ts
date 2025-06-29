import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthMicroserviceController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_login' })
  async handleLogin(@Payload() data: { email: string; password: string }) {
    const { email, password } = data;
    return this.authService.validateUser(email, password);
  }

  @MessagePattern({ cmd: 'auth_refresh' })
  async handleRefresh(@Payload() data: { refreshToken: string }) {
    return this.authService.refresh(data.refreshToken);
  }
}
