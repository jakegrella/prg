import { isAdmin } from '@/access/isAdmin'
import { isUser } from '@/access/isUser'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: isAdmin,
    read: ({ req }) => {
      // console.log('user', req.user)
      if (isAdmin({ req })) return true
      if (isUser({ req })) {
        return {
          'settings.audience': {
            equals: 'staff',
          },
        }
      }
      return false
    },
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'status',
          admin: {
            description: 'Published pages are visible to users',
          },
          type: 'select',
          options: [
            {
              label: 'Draft',
              value: 'draft',
            },
            {
              label: 'Published',
              value: 'published',
            },
          ],
          defaultValue: 'draft',
          required: true,
        },
        {
          name: 'audience',
          admin: {
            description: 'The audience determines which users can view this page',
          },
          type: 'select',
          options: [
            {
              label: 'All Staff',
              value: 'staff',
            },
            {
              label: 'Managers and Admins',
              value: 'manager',
            },
            {
              label: 'Admins Only',
              value: 'admin',
            },
          ],
          defaultValue: 'admin',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            description:
              'This page will be available to authenticated users at test.com/pages/<slug>',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      //   editor: lexicalEditor({}), // add custom editor options here
    },
  ],
}
