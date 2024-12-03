const express = require('express');
const { predict, getHistories } = require('../controllers/predictController');
const { upload, fileSizeErrorHandler }= require('../midlewares/uploadMiddleware');

const router = express.Router();

router.post('/predict', upload.single('image'), fileSizeErrorHandler, predict)
router.get('/predict/histories', getHistories);

module.exports = router;
