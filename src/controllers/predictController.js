const tf = require('@tensorflow/tfjs-node');
const { db } = require('../utils/firebase');
const { v4: uuidv4 } = require('uuid');
let model; // Import model dari modelLoader.js

async function predict(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'Gambar tidak ditemukan!' });
    }

    // Konversi buffer gambar ke tensor
    const buffer = req.file.buffer;
    const imageTensor = tf.node.decodeImage(buffer).resizeBilinear([224, 224]).expandDims(0);

    // Inferensi menggunakan model
    const predictions = await model.predict(imageTensor).data();
    const result = predictions[0] > 0.5 ? 'Cancer' : 'Non-cancer';
    const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    // Simpan hasil ke Firestore
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const predictionData = { id, result, suggestion, createdAt };
    await db.collection('predictions').doc(id).set(predictionData);

    res.json({
      status: 'success',
      message: 'Model is predicted succesfully',
      data: predictionData,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'fail', message: 'Terjadi kesalahan dalam melakukan prediksi' });
  }
}
async function getHistories(req, res) {
    try {
      // Ambil semua dokumen dari koleksi 'predictions'
      const snapshot = await db.collection('predictions').orderBy('createdAt', 'desc').get();
  
      if (snapshot.empty) {
        return res.json({ status: 'success', message: 'Tidak ada riwayat prediksi', data: [] });
      }
  
      // Proses hasil dokumen menjadi array
      const histories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.json({
        status: 'success',
        message: 'Riwayat prediksi berhasil diambil',
        data: histories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan dalam mengambil riwayat prediksi' });
    }
  }

module.exports = { predict, setModel: (loadedModel) => (model = loadedModel), getHistories };

