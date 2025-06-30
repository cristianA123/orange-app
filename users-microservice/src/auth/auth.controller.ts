import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthMicroserviceController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'AUTH_LOGIN' })
  async handleLogin(@Payload() data: { email: string; password: string }) {
    const { email, password } = data;
    return this.authService.validateUser(email, password);
  }

  @MessagePattern({ cmd: 'AUTH_REFRESH' })
  async handleRefresh(@Payload() data: { refreshToken: string }) {
    return this.authService.refresh(data.refreshToken);
  }
}
