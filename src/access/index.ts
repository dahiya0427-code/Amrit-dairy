import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'manager' | 'editor'

const hasRole =
  (...roles: Role[]) =>
  ({ req: { user } }: { req: { user: unknown } }) =>
    Boolean(user && roles.includes((user as { role?: Role }).role as Role))

export const anyone: Access = () => true
export const loggedIn: Access = ({ req: { user } }) => Boolean(user)
export const admins: Access = hasRole('admin')
export const adminsOrManagers: Access = hasRole('admin', 'manager')
export const adminsFieldLevel: FieldAccess = hasRole('admin')
