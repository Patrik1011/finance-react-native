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

    console.log('User:', user.role);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.role || user.role !== Role.PremiumUser) {
      throw new ForbiddenException('Premium subscription required');
    }

    return true;
  }
}
