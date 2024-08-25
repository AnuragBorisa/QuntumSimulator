import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });

  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|txt|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Files Only!');
    }
  }

  export const upload = multer({
    storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).single('file');