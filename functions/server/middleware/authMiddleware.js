const {admin} = require("../models/db");
//https://www.youtube.com/watch?v=hkxyt8FImcM&t=928s&ab_channel=DiligentDev
//tutorial for implementation

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
module.exports = validateFirebaseIdToken = async (req, res, next) => {
	console.log('Check if request is authorized with Firebase ID token');
  
	if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
		!(req.cookies && req.cookies.__session)) {
			console.log(
		'No Firebase ID token was passed as a Bearer token in the Authorization header.',
		'Make sure you authorize your request by providing the following HTTP header:',
		'Authorization: Bearer <Firebase ID Token>',
		'or by passing a "__session" cookie.'
	  );
	  res.status(403).send('Unauthorized');
	  return;
	}

  //makes sure no unotherised people can acces
	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
	  console.log('Found "Authorization" header');
	  // Read the ID Token from the Authorization header.
	  idToken = req.headers.authorization.split('Bearer ')[1];
	} else if(req.cookies) {
		console.log('Found "__session" cookie');
	  // Read the ID Token from cookie.
	  idToken = req.cookies.__session;
	} else {
	  // No cookie
	  res.status(403).send('Unauthorized');
	  return;
	}

	try {
		const decodedIdToken = await admin.auth().verifyIdToken (idToken);
		//console.log('ID Token correctly decoded', decodedIdToken);
		if (userSnapshot.exists) {
		  const userRole = userSnapshot.data().roles;
			console.log(userRole);
			  //Voeg de rol oe aan req. user
		  req.user = { decodedIdIdToken, role: userRole };
		  next();
		  return;
		} else {
		  console.log('Gebruiker niet gevonden in de database');
		  res.status (403).send('Unauthorized');
		  return;
		}
  
// In authMiddleware.js

// try {
// 	const decodedIdToken = await admin.auth().verifyIdToken(idToken);
// 	const userId = decodedIdToken.uid;
// 	console.log(userId);
// 	// Rolgegevens ophalen uit de database (Firestore)
// 	const userSnapshot = await admin.firestore().collection('user_groep2').doc(userId).get();
  
// 	if (userSnapshot.exists) {
// 	  const userRole = userSnapshot.data().roles;
// 		console.log(userRole);
// 	  // Voeg de rol toe aan req.user
// 	  req.user = { ...decodedIdToken, role: userRole };
// 	  next();
// 	  return;
// 	} else {
// 	  console.log('Gebruiker niet gevonden in de database');
// 	  res.status(403).send('Unauthorized');
// 	  return;
// 	}


//if there is no token or invalid token this error is trown
  } catch (error) {
	console.log('Error while verifying Firebase ID token:', error);
	res.status(403).send('Unauthorized');
	return;
  }
	};
  

// 	try {
// 	  const decodedIdToken = await admin.auth().verifyIdToken(idToken);
// 	  //console.log('ID Token correctly decoded', decodedIdToken);
// 	  req.user = decodedIdToken;
// 	  next();
// 	  return;
// 	} catch (error) {
// 		console.log('Error while verifying Firebase ID token:', error);
// 	  res.status(403).send('Unauthorized');
// 	  return;
// 	}
//   };
	