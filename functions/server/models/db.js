const admin = require("firebase-admin");
var serviceAccount = require("../../technoviumunlimited-firebase-adminsdk-6vhe0-d237ed1d36.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

module.exports = db;