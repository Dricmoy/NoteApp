// schemas/course.js
export default {
    name: 'course',
    title: 'Course',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Course Name',
        type: 'string',
      },
      {
        name: 'cid',
        title: 'Course ID',
        type: 'string',
      },
      {
        name: 'university',
        title: 'University',
        type: 'reference',
        to: [{ type: 'university' }]
      }
    ]
  }
  