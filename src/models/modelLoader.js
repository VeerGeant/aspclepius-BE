const tf = require('@tensorflow/tfjs-node');
const { setModel } = require('../controllers/predictController');

const modelURL = 'https://storage.googleapis.com/asclepius-bk/submissions-model/model.json'; // Ganti dengan jalur model yang benar

async function loadModel() {
  try {
    console.log('Memuat model dari:', modelURL);
    const model = await tf.loadGraphModel(modelURL);
    setModel(model);
    console.log('Model berhasil dimuat!');
  } catch (error) {
    console.error('Gagal memuat model:', error.message);
    throw error;
  }
}

module.exports = { loadModel };
