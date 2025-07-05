import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function handleRpcError(error: any): never {
  if (typeof error === 'object' && error?.statusCode) {
    switch (error.statusCode) {
      case 401:
        throw new UnauthorizedException(error.message);
      case 404:
        throw new NotFoundException(error.message);
      default:
        throw new InternalServerErrorException(error.message);
    }
  }

  throw new InternalServerErrorException(error?.message || 'Error interno');
}
