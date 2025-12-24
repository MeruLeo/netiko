import { createUploader } from '#src/middlewares/upload.js';

const uploadAvatarImage = createUploader({
  folder: 'avatars',
  maxFileSizeMB: 5,
});

export default uploadAvatarImage;
