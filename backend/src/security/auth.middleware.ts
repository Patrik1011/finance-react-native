import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AccessType, accessTypeToRoles, getAccessLevel } from './routes';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the full path by combining baseUrl and path
      const fullPath = req.baseUrl + req.path;
      const method = req.method;

      // Check access level required for this path
      const accessLevel = getAccessLevel(fullPath, method);

      // If it's a public route, skip authentication
      if (accessLevel === AccessType.PUBLIC) {
        return next();
      }

      // For non-public routes, verify JWT token
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authentication required');
      }

      const token = authHeader.substring(7);

      try {
        // Verify token
        const user = this.jwtService.verify(token);

        console.log('Decoded JWT:', user);

        req['user'] = user; // Attach user to request

        // For role-specific routes, check user role
        if (
          accessLevel === AccessType.PREMIUM_USER ||
          accessLevel === AccessType.ADMIN
        ) {
          const requiredRoles = accessTypeToRoles[accessLevel];
          const userRole = user.role;

          // Check if user has required role
          const hasAccess = requiredRoles.some((role) => role === userRole);

          if (!hasAccess) {
            throw new UnauthorizedException('Insufficient permissions');
          }
        }

        next();
      } catch (error) {
        if (
          error.name === 'JsonWebTokenError' ||
          error.name === 'TokenExpiredError'
        ) {
          throw new UnauthorizedException('Invalid or expired token');
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
