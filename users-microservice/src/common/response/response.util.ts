export function successResponse<T>(data: T, message = 'Operación exitosa') {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message = 'Ocurrió un error', data: any = null) {
  return {
    success: false,
    message,
    data,
  };
}
