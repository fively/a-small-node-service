import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4, validate } from 'uuid';
import { REQUEST_ID_TOKEN_HEADER } from '../constant';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.headers[REQUEST_ID_TOKEN_HEADER] || !validate(req.headers(REQUEST_ID_TOKEN_HEADER))) {
      req.headers[REQUEST_ID_TOKEN_HEADER] = v4();
    }

    res.setHeader(REQUEST_ID_TOKEN_HEADER, req.headers[REQUEST_ID_TOKEN_HEADER]);
    next();
  }
}
