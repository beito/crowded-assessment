import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = httpContext.getResponse();

    const method = request.method;
    const url = request.url;
    const start = Date.now();

    this.logger.log(`${method} ${url} - Request received`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const statusCode = response.statusCode;

        this.logger.log(
          `${method} ${url} - Completed in ${duration}ms - Status: ${statusCode}`,
        );
      }),
    );
  }
}
