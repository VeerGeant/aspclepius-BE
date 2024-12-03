const multer = require('multer');
const path = require('path');

// Konfigurasi multer
const upload = multer({
  limits: { fileSize: 1 * 1024 * 1024 }, // Maksimum 1 MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Hanya file gambar (JPEG, JPG, PNG) yang diizinkan!'));
  },
});

// Middleware untuk menangani error ukuran file
const fileSizeErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000',
    });
  }
  next(err); // Lanjutkan ke error handler lainnya jika bukan LIMIT_FILE_SIZE
};

module.exports = { upload, fileSizeErrorHandler };
