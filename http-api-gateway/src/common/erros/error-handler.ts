import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

const RPC_ERROR_MAP = {
  400: BadRequestException,
  401: UnauthorizedException,
  403: ForbiddenException,
  404: NotFoundException,
  408: GatewayTimeoutException,
  409: ConflictException,
  422: BadRequestException,
  500: InternalServerErrorException,
  502: ServiceUnavailableException,
  503: ServiceUnavailableException,
  504: GatewayTimeoutException,
};

export function handleRpcError(error: any): never {
  if (
    error instanceof BadRequestException ||
    error instanceof UnauthorizedException ||
    error instanceof NotFoundException
  ) {
    throw error;
  }

  const statusCode = extractStatusCode(error);
  const message = extractErrorMessage(error);
  const serviceName = error?.service || error?.source || 'Microservicio';

  if (statusCode && RPC_ERROR_MAP[statusCode]) {
    throw new RPC_ERROR_MAP[statusCode](message || `Error en ${serviceName}`);
  }

  if (error?.errors && Array.isArray(error.errors)) {
    const validationErrors = error.errors
      .map(
        (err) =>
          `${err.property}: ${Object.values(err.constraints).join(', ')}`,
      )
      .join('; ');

    throw new BadRequestException(validationErrors || 'Error de validación');
  }

  if (isDatabaseError(error)) {
    return handleDatabaseError(error);
  }

  throw new InternalServerErrorException(
    message || `Error interno en ${serviceName}`,
  );
}

function extractStatusCode(error: any): number | null {
  if (!error || typeof error !== 'object') return null;

  return (
    error.statusCode ??
    error.status ??
    error.code ??
    (error.response?.status || null)
  );
}

function extractErrorMessage(error: any): string {
  if (!error) return 'Error desconocido';

  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error) return error.error;
  if (error.response?.message) return error.response.message;

  return 'Error en comunicación entre servicios';
}

function isDatabaseError(error: any): boolean {
  return (
    error?.name === 'PrismaClientKnownRequestError' ||
    error?.code?.startsWith('SQL') ||
    error?.name === 'MongoError'
  );
}

function handleDatabaseError(error: any): never {
  if (error.code === 'P2002' || error.code === 11000) {
    const field = error.meta?.target?.[0] || 'campo desconocido';
    throw new ConflictException(`El valor para ${field} ya existe`);
  }

  if (error.code === 'P2003') {
    throw new BadRequestException('Referencia inválida');
  }

  throw new InternalServerErrorException('Error en base de datos');
}
