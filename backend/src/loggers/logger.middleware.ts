import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = new Date();
    const { method, path, baseUrl, originalUrl } = req;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`REQUEST [${startTime.toISOString()}]`);
    console.log(`Endpoint: ${method} ${originalUrl}`);
    console.log(`Path: ${path}`);
    console.log(`Base URL: ${baseUrl}`);

    // console.log('Headers:', JSON.stringify(req.headers));

    if (req.user) {
      console.log('User Payload:', JSON.stringify(req.user));
    } else {
      console.log('User: Not authenticated');
    }

    const originalSend = res.send;
    res.send = function (body) {
      console.log(`Response status: ${res.statusCode}`);
      return originalSend.call(this, body);
    };

    next();
  }
}
