import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from 'src/utils/enums';

@Injectable()
export class PremiumUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if the user has the PREMIUM_USER role
    if (!user.roles.includes(Role.PREMIUM_USER)) {
      throw new ForbiddenException('Premium subscription required');
    }

    return true;
  }
}
