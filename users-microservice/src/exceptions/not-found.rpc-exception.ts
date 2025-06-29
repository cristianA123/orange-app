import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

export function NotFoundRpcException() {
  return new RpcException({
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Usuario no encontrado',
  });
}
