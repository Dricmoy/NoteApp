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
        name: 'professorName',
        title: 'Professor Name',
        type: 'string',
      },
      {
        name: 'semester',
        title: 'Semester',
        type: 'string',
        options: {
          list: [
            { title: 'Fall', value: 'fall' },
            { title: 'Winter', value: 'winter' },
            { title: 'Spring', value: 'spring' },
            { title: 'Summer', value: 'summer' },
          ],
        },
      },
      {
        name: 'year',
        title: 'Year',
        type: 'string',
      },
      {
        name: 'university',
        title: 'University',
        type: 'reference',
        to: [{ type: 'university' }],
      },
      {
        name: 'image',
        title: 'Course Image',
        type: 'image',
        options: {
          hotspot: true, // Enables image cropping and resizing
        },
      },
    ],
  };
  