import type { Access } from 'payload'

// any logged in user
export const isUser: Access = ({ req: { user } }) => !!user
