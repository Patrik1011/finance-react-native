import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AccessType, getAccessLevel } from './routes';
import { Role } from 'src/utils/enums';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const fullPath = req.baseUrl + req.path;
    const method = req.method;

    const accessLevel = getAccessLevel(fullPath, method);

    if (accessLevel === AccessType.Public) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authHeader.substring(7);

    try {
      const user = this.jwtService.verify(token);

      console.log('User:', decodeURIComponent(JSON.stringify(user)));

      req['user'] = user;

      switch (accessLevel) {
        case AccessType.User:
          break;

        case AccessType.PremiumUser:
          console.log('User role:', user.roles);
          console.log('Access type:', accessLevel);
          // Only premium users and admins can access PREMIUM_USER resources
          if (user.roles !== Role.PremiumUser) {
            throw new UnauthorizedException('Premium subscription required');
          }
          break;

        case AccessType.Admin:
          if (user.roles !== Role.Admin) {
            throw new UnauthorizedException('Admin privileges required');
          }
          break;
      }

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      throw error;
    }
  }
}
