import multer from 'multer';
import path from 'path';
import fs from 'fs';

function createStorage(folder: string) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../../public/imgs/${folder}`);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
}

function fileFilter(req: any, file: Express.Multer.File, cb: any) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .png, .webp files are allowed!'));
  }
}

export function uploadTo(folder: string) {
  return multer({
    storage: createStorage(folder),
    fileFilter,
  });
}
