// schemas/university.js
export default {
    name: 'university',
    title: 'University',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'uid',
        title: 'University ID',
        type: 'string',
      },
      {
        name: 'courses',
        title: 'Courses',
        type: 'array',
        of: [
          {
            type: 'reference',
            to: [{ type: 'course' }]
          }
        ]
      }
    ]
  }
  