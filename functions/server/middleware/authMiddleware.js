const { admin } = require("../models/db");

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// When decoded successfully, the ID Token content will be added as `req.user`.
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
  } else if (req.cookies) {
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
    req.user = decodedIdToken; // User data is available in req.user

    // Get user's custom claims to check for roles
    const uid = decodedIdToken.uid;
    const userRecord = await admin.auth().getUser(uid);

    const userSnapshot = await admin.firestore().collection('user_groep1').doc(uid).get();
  
    if (userSnapshot.exists) {
      const userRole = userSnapshot.data().roles;
      console.log(userRole);
    
    // console.log('Gebruikerrechten:', userRecord);
 

      // Check roles and assign permissions based on roles
      switch (userRole) {
        case 'student':
          req.user.permissions = ['add_game'];
          break;
        case 'docent':
          req.user.permissions = ['add_game', 'add_blog', 'add_comment','edit_blog'];
          break;
        case 'admin':
          req.user.permissions = ['add_game', 'add_blog', 'add_comment', 'delete_all','edit_blog'];
          break;
        default:
          req.user.permissions = ['niks']; // No special permissions for other roles
      }
    } else {
      // If no specific role claims are set, use a default role and permissions
      req.user.role = 'student';
      req.user.permissions = ['add_game'];
    }

    next();
    return;
  } catch (error) {
    console.log('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};
