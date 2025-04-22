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
    // Get the full path and method
    const fullPath = req.baseUrl + req.path;
    const method = req.method;

    // Check access level required for this path
    const accessLevel = getAccessLevel(fullPath, method);

    // Allow public routes to pass through
    if (accessLevel === AccessType.Public) {
      return next();
    }

    // Validate auth header format
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authHeader.substring(7);

    try {
      // Verify token and attach user to request
      const user = this.jwtService.verify(token);

      console.log('User:', decodeURIComponent(JSON.stringify(user)));

      req['user'] = user;

      // Check if user has sufficient permissions for the requested resource
      switch (accessLevel) {
        case AccessType.User:
          // Any authenticated user can access USER level resources
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
          // Only admins can access ADMIN resources
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

      // Standardize JWT errors
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
