import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { handleRpcError } from '../../users/exceptions/handle-rpc-error.util';

@Injectable()
export class NatsAuthGuard implements CanActivate {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const { user, token: newToken } = await firstValueFrom(
        this.client.send('VERIFY_TOKEN', token),
      );
      request['user'] = user;
      request['token'] = newToken;
    } catch (error) {
      handleRpcError(error);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
