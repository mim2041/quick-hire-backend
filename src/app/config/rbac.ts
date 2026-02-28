/**
 * Role–permission map for RBAC.
 * Guard chain: authenticate → requirePermission → validateRequest → controller.
 */
export const PERMISSIONS = {
  JOB_CREATE: 'job:create',
  JOB_DELETE: 'job:delete',
  JOB_UPDATE: 'job:update',
  APPLICATION_READ: 'application:read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    PERMISSIONS.JOB_CREATE,
    PERMISSIONS.JOB_DELETE,
    PERMISSIONS.JOB_UPDATE,
    PERMISSIONS.APPLICATION_READ,
  ],
  applicant: [],
};

export function getPermissionsForRole(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: string, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission);
}
