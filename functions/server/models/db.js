const admin = require("firebase-admin");
const firebaseConfig = require("../../firebase_config");

admin.initializeApp({
	credential: admin.credential.cert(firebaseConfig)
});

const db = admin.firestore();
//db.FieldValue.serverTimestamp()

//db.Timestamp.now().toDate()

module.exports = {
	"db" : db,
	"admin" : admin
};

