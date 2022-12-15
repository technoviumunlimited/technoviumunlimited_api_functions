const firebaseConfig = {
	"type": "service_account",
	"project_id": process.env._FIREBASE_PROJECT_ID,
	"private_key_id": process.env._FIREBASE_PRIVATE_KEY_ID,
	"private_key": process.env._FIREBASE_PRIVATE_KEY,
	"client_email": process.env._FIREBASE_CLIENT_EMAIL,
	"client_id": process.env._FIREBASE_CLIENT_ID,
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6vhe0%40technoviumunlimited.iam.gserviceaccount.com"
  }
  
  module.exports = firebaseConfig;