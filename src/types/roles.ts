export type UserRole = 'admin' | 'moderator' | 'member';

export interface Permission {
  canCreateEvents: boolean;
  canEditEvents: boolean;
  canDeleteEvents: boolean;
  canManageUsers: boolean;
  canManageWorkspaces: boolean;
}

export const RolePermissions: Record<UserRole, Permission> = {
  admin: {
    canCreateEvents: true,
    canEditEvents: true,
    canDeleteEvents: true,
    canManageUsers: true,
    canManageWorkspaces: true
  },
  moderator: {
    canCreateEvents: true,
    canEditEvents: true,
    canDeleteEvents: false,
    canManageUsers: false,
    canManageWorkspaces: true
  },
  member: {
    canCreateEvents: false,
    canEditEvents: false,
    canDeleteEvents: false,
    canManageUsers: false,
    canManageWorkspaces: false
  }
};
