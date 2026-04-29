import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import { isAdminOrManager } from '@/access/isAdminOrManager'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import type { CollectionConfig } from 'payload'

// users logging into admin panel
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: isAdmin, // only admins can create users
    read: isAdminOrSelf, // only admins or the user themselves can read
    update: isAdminOrSelf, // only admins or the user themselves can update
    delete: isAdmin, // only admins can delete
    admin: isAdminOrManager, // only admins and managers can use this collection to access admin panel
  },
  fields: [
    // Email added by default
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    {
      name: 'nickname',
      type: 'text',
      required: false,
    },
    {
      name: 'roles',
      saveToJWT: true, // allows use from req.user
      type: 'select',
      hasMany: true,
      defaultValue: ['staff'],
      required: true,
      access: {
        create: isAdminFieldLevel, // only admins can create new roles
        update: isAdminFieldLevel, // only admins can update user roles
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Manager',
          value: 'manager',
        },
        {
          label: 'Staff',
          value: 'staff',
        },
      ],
    },
  ],
}
