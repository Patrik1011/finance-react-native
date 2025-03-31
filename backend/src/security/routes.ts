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
  {
    pattern: 'users/downgrade/',
    method: 'POST',
    access: AccessType.PREMIUM_USER,
  },

  { pattern: '/categories/', method: 'POST', access: AccessType.USER },
  { pattern: '/categories/', method: 'GET', access: AccessType.USER },
  { pattern: '/categories/:id', method: 'PUT', access: AccessType.PREMIUM_USER },
  { pattern: '/categories/:id', method: 'DELETE', access: AccessType.PREMIUM_USER },

  { pattern: '/entries/', method: 'POST', access: AccessType.USER },
  { pattern: '/entries/:id', method: 'GET', access: AccessType.USER },
  { pattern: '/entries/:id', method: 'PUT', access: AccessType.PREMIUM_USER },
  { pattern: '/entries/:id', method: 'DELETE', access: AccessType.USER },

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

export function canAccess(userRoles: Role[], requiredAccess: AccessType): boolean {
  if (requiredAccess === AccessType.PUBLIC) return true;
  
  if (userRoles.includes(Role.ADMIN)) return true;
  
  // Premium users can access USER and PREMIUM_USER routes
  if (requiredAccess === AccessType.USER && userRoles.includes(Role.PREMIUM_USER)) return true;
  
  // For PREMIUM_USER access, user must have PREMIUM_USER role
  if (requiredAccess === AccessType.PREMIUM_USER && userRoles.includes(Role.PREMIUM_USER)) return true;
  
  // For USER access, basic authentication is enough (handled by middleware)
  if (requiredAccess === AccessType.USER) return true;
  
  return false;
}

export const accessTypeToRoles = {
  [AccessType.PUBLIC]: null,
  [AccessType.USER]: [],
  [AccessType.PREMIUM_USER]: [Role.PREMIUM_USER],
  [AccessType.ADMIN]: [Role.ADMIN],
};
