import type { Access, PayloadRequest } from 'payload'

// I don't think admin is typed like rest of access
type AccessFunction = ({ req }: { req: PayloadRequest }) => boolean | Promise<boolean>

export const isAdminOrManager: AccessFunction = ({ req: { user } }) => {
  if (!user) return false
  return user.roles.includes('admin') || user.roles.includes('manager')
}
