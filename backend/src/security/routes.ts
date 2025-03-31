import { Role } from 'src/utils/enums';

export enum AccessType {
  PUBLIC = 'public',
  USER = 'user',
  PREMIUM_USER = 'premium-user',
  ADMIN = 'admin',
}

type RouteAccess = {
  pattern: string;
  method: string;
  access: AccessType;
};

export const routeAccessMap: RouteAccess[] = [
  { pattern: '/auth/login/', method: 'POST', access: AccessType.PUBLIC },
  { pattern: '/auth/signup/', method: 'POST', access: AccessType.PUBLIC },
  { pattern: '/auth/create-admin/', method: 'POST', access: AccessType.PUBLIC },

  { pattern: '/users/upgrade/', method: 'POST', access: AccessType.USER },
  { pattern: 'users/downgrade/', method: 'POST', access: AccessType.PREMIUM_USER },

  // Default - require authentication
  { pattern: '/*', method: '*', access: AccessType.USER },
];

// Function to get access level for a specific route
export function getAccessLevel(path: string, method: string): AccessType {
  // Ensure path starts with a forward slash for consistency
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // First check for exact matches
  const exactMatch = routeAccessMap.find(
    (route) =>
      route.pattern === normalizedPath &&
      (route.method === method || route.method === '*'),
  );

  if (exactMatch) {
    return exactMatch.access;
  }

  // Then check for pattern matches (with params)
  for (const route of routeAccessMap) {
    // Skip the wildcard route until the end
    if (route.pattern === '/*') continue;

    // Convert route pattern to regex
    // Replace :paramName with regex for matching params
    const regexPattern = route.pattern
      .replace(/:[^\/]+/g, '[^/]+')
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);

    if (
      regex.test(normalizedPath) &&
      (route.method === method || route.method === '*')
    ) {
      return route.access;
    }
  }

  // Default to the wildcard route
  const wildcard = routeAccessMap.find((route) => route.pattern === '/*');
  return wildcard ? wildcard.access : AccessType.USER;
}

export const accessTypeToRoles = {
  [AccessType.PUBLIC]: null,
  [AccessType.USER]: [],
  [AccessType.PREMIUM_USER]: [Role.PREMIUM_USER],
  [AccessType.ADMIN]: [Role.ADMIN],
};
