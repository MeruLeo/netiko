import { createUploader } from '#src/middlewares/upload.js';

export const uploadProjectCover = createUploader({
  folder: 'projects-cover',
  maxFileSizeMB: 5,
});

export const uploadProjectImages = createUploader({
  folder: 'projects-images',
  maxFileSizeMB: 10,
});
