const admin = require('firebase-admin');
const serviceAccount = require('./path-to-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pneumonia2024-default-rtdb.firebaseio.com/'
});

const sendNotification = (token, message) => {
  const payload = {
    notification: {
      title: 'Data Pasien Diterima',
      body: message
    }
  };

  admin.messaging().sendToDevice(token, payload)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};

// Example usage
const adminToken = 'RECEIVER_ADMIN_FCM_TOKEN';
sendNotification(adminToken, 'Dokter telah menerima data pasien.');
