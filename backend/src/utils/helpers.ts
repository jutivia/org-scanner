import { SuccessResponseDto } from './types';

export function successResponse<T>(
  data: T,
  options?: {
    message?: string;
    statusCode?: number;
  },
): SuccessResponseDto<T> {
  return {
    data,
    statusCode: options && options.statusCode ? options.statusCode : 200,
    message: options && options.message ? options.message : 'OK!',
  };
}
