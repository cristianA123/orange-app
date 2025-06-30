import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

export function UnauthorizedRpcException() {
  return new RpcException({
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'Credenciales incorrectas',
  });
}
