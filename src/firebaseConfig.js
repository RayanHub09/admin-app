import admin from 'firebase-admin';
import serviceAccount from './path/to/serviceAccountKey.json'; // Укажите путь к вашему файлу ключа

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
