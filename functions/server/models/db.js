const admin = require("firebase-admin");
const firebaseConfig = require("../../firebase_config");

admin.initializeApp({
	credential: admin.credential.cert(firebaseConfig)
});

	//var bucket = admin.storage().bucket();
	
	//console.log(bucket);

const db = admin.firestore();
const storage = admin.storage();
//db.FieldValue.serverTimestamp()

//db.Timestamp.now().toDate()

module.exports = {
	"db" 		: db,
	"admin" 	: admin,
	"storage" 	: storage
};

