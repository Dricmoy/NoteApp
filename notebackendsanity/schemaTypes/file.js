// schemas/file.js

export default {
    name: 'file',
    title: 'File',
    type: 'document',
    fields: [
      {
        name: 'fileName',
        title: 'File Name',
        type: 'string',
      },
      {
        name: 'file',
        title: 'PDF File',
        type: 'file',
      },
      {
        name: 'thumbnail',
        title: 'Thumbnail',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'courseCid',
        title: 'Course CID',
        type: 'string',
      },
    ],
  };
  