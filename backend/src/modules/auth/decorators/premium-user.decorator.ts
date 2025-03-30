import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PremiumGuard } from '../guards/premium-user.guard';

export function Premium() {
  return applyDecorators(UseGuards(JwtAuthGuard, PremiumGuard));
}
