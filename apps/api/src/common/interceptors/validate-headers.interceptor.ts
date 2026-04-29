/* eslint-disable no-control-regex */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const ASCII_ONLY_HEADERS = [
  'accept',
  'accept-language',
  'content-language',
  'content-type',
];

@Injectable()
export class ValidateHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string> }>();
    const headers = request.headers;

    for (const [key, value] of Object.entries(headers)) {
      if (ASCII_ONLY_HEADERS.includes(key.toLowerCase())) {
        if (typeof value === 'string' && !/^[\x00-\x7F]*$/.test(value)) {
          throw new BadRequestException(
            `Header ${key} must contain only ASCII characters`,
          );
        }
      }
    }

    const contentType = headers['content-type'];
    if (contentType && !/^[\x00-\x7F]*$/.test(contentType)) {
      throw new BadRequestException(
        'Content-Type header must contain only ASCII characters',
      );
    }

    return next.handle();
  }
}
