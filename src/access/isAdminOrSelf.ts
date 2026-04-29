import type { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  // need to be logged in
  if (user) {
    // user has admin role
    if (user.roles?.includes('admin')) return true

    // if user is accessing their own record
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // if not logged in, or doesn't meet other criteria, can't access
  return false
}
