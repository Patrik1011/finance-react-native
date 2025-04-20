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

// Define routes with RegExp patterns directly
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

// Default access level when no route matches
const DEFAULT_ACCESS = AccessType.User;

// Function to get access level
export function getAccessLevel(path: string, method: string): AccessType {
  // Ensure path starts with a forward slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Find the first matching route
  const match = routeAccessMap.find(
    (route) =>
      route.pattern.test(normalizedPath) &&
      (route.method === method || route.method === '*'),
  );

  return match ? match.access : DEFAULT_ACCESS;
}
