const { Firestore } = require('@google-cloud/firestore');

// Inisialisasi Firestore dengan konfigurasi yang benar
const firestore = new Firestore({
  projectId: 'ubmissionmlgc-ilhamf', // Ganti dengan project ID Anda
  keyFilename: './submissionmlgc-ilhamf.json', // Path ke file service account key
});

// Export instance Firestore
module.exports = { db: firestore };
