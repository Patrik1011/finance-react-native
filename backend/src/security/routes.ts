export enum AccessType {
  Public = 'PUBLIC',
  User = 'USER',
  PremiumUser = 'PREMIUM_USER',
  Admin = 'ADMIN',
}

type RouteAccess = {
  pattern: RegExp;
  method: string;
  access: AccessType;
};

export const routeAccessMap: RouteAccess[] = [
  { pattern: /^\/auth\/login\/?$/, method: 'POST', access: AccessType.Public },
  { pattern: /^\/auth\/signup\/?$/, method: 'POST', access: AccessType.Public },
  {
    pattern: /^\/auth\/create-admin\/?$/,
    method: 'POST',
    access: AccessType.Public,
  },

  { pattern: /^\/users\/upgrade\/?$/, method: 'POST', access: AccessType.User },
  {
    pattern: /^\/users\/downgrade\/?$/,
    method: 'POST',
    access: AccessType.PremiumUser,
  },

  {
    pattern: /^\/categories\/?$/,
    method: 'POST',
    access: AccessType.PremiumUser,
  },
];

const DEFAULT_ACCESS = AccessType.User;

export function getAccessLevel(path: string, method: string): AccessType {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const match = routeAccessMap.find(
    (route) =>
      route.pattern.test(normalizedPath) &&
      (route.method === method || route.method === '*'),
  );

  return match ? match.access : DEFAULT_ACCESS;
}
