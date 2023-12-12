const {admin, db} = require("../models/db");
const ROLES = ["student", "docent", "bedrijf", "admin"];
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
	  const decodedIdToken = await admin.auth().verifyIdToken(idToken);
	  //console.log('ID Token correctly decoded', decodedIdToken);

	  const userSnapshot = await db.collection('user_groep(svenjasper)').doc(decodedIdToken.uid).get();
	  console.log(" db.collection('users').doc(decodedIdToken.uid).get()")
	  console.log(userSnapshot.exists)
    if (!userSnapshot.exists) {
      console.log('User not found in Firestore');
      res.status(403).send('Unauthorized');
      return;
    }
	const userData = userSnapshot.data();
    if (!userData || !userData.roles) {
      console.log('User has no role assigned');
      res.status(403).send('Unauthorized');
      return;
    }

	const allowedRoles = ['docent', 'student', 'bedrijf', 'admin'];
    const userRoles = userData.roles.map(role => role.toLowerCase());

    const hasValidRole = userRoles.some(role => allowedRoles.includes(role));
    if (!hasValidRole) {
      console.log('User does not have the required role');
      res.status(403).send('Unauthorized');
      return;
    }

	  req.user = decodedIdToken;
	  req.user.roles = userData.roles;
	  next();
	  return;
	} catch (error) {
		console.log('Error while verifying Firebase ID token:', error);
	  res.status(403).send('Unauthorized');
	  return;
	}
  };
  