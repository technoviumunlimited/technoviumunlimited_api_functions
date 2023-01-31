const { db, admin } = require("../models/db");

exports.getLevelsOfGame = async (req, res, next) => {
	let paramID = req.params.id;
	try {
		const scores = [];
		const query = await db.collection("games").get(paramID).collection("levels").get();

		query.forEach((level) => levels.push({ ...level.data(), _id: level.id }));

		res.status(200).json({ levels });
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
};

exports.getLevelData = async (req, res, next) => {
	let paramID = req.params.game_id;
	try {
		score_users = [];
		level_datas = [];

		const query = await db.collection("games").doc(paramID)
							  .collection("levels").doc("1")
							  .collection("score_users").orderBy("started", "desc").limit(1).get()
		query.forEach((score_user) => score_users.push({...score_user.data(), _id: score_user.id}));

		console.log(score_users[0]._id)

		const query2 = await db.collection("games").doc(paramID)
							  .collection("levels").doc("1")
							  .collection("score_users")
							  .doc(score_users[0]._id)
							  .collection("level_data")
							  .orderBy("created", "desc").limit(1).get();
		
		query2.forEach((level_data) => level_datas.push({...level_data.data(), bin: level_data.binary}));
		binary = level_datas[0].binary;
		res.status(200).json({binary});
	}
	catch (err) {
		console.error(err);
		res.status(500).send();
	}
}

exports.insertLevelUserScoreData = async (req, res, next) => {
	let gameID = req.body.game_id;
	let levelID = req.body.level_id;
	let userID = req.user.user_id;
	console.log(userID);
	console.log(gameID);
	console.log(levelID);

		try{
			
			const startedField = await db.collection("games").doc(gameID).collection("levels").doc(levelID).collection("score_users").doc(userID).get();
			
			const seconds = (startedField._fieldsProto.started.timestampValue.seconds);
			const nanos = (startedField._fieldsProto.started.timestampValue.nanos);

			const nanosmath = nanos/1000000;

			const correctTimestamp = Math.floor(seconds*1000 + nanosmath);

			if (correctTimestamp <= Date.now()-3600000) {
				console.log("Timestamp is 1 hour or more older than the current Timestamp, posting new timestamp");
				await db.collection("games").doc(gameID).collection("levels").doc(levelID).collection("score_users").doc(userID).set({"started" : admin.firestore.FieldValue.serverTimestamp()});
				console.log("Record added!");
			} else {
				console.log("Timestamp is NOT 1 hour or more older than the current Timestamp, no new record added to firebase");
			}
			
			//Show date, converted from firebase Timestamp:
			var x = correctTimestamp; //gets the timestamp from firebase
			var mydate = new Date(x);
			[mydate.getMonth()];
			[mydate.getDay()];
			console.log("Firebase record, date/time: " + mydate.toString());		
			
			//Show date, converted from current Timestamp:
			var y = Date.now();
			var mydate = new Date(y);
			console.log("Current date/time: " + mydate.toString());	


		} catch (error) {
			console.error(error);
			res.status(500).send();
		}

	}

	// exports.functionName =
	// 	functions.https.onRequest(async (request, response) => {
			
	// 		try {
			
	// 			const scenario = await fetchScenarioJSON(request.query.gameID);
	// 			if (typeof scenario === "string") {
	// 				if (scenario.includes("not valid json")) {
	// 					response.send("not valid json");
	// 				}
	// 			} else {
	// 				await addDataToFirestore(scenario);  // See the await here
	// 				response.send(`Done! Added scenario with ID ${request.query.gameID} to the app database.`);
	// 			}
	// 		} catch (error) {
	// 			// ...
	// 		}
	
	// 	});

// 	try {
// 		score_users = [];
// 		level_datas = [];

// 		const query = await db.collection("games").doc(paramID)
// 							  .collection("levels").doc("1")
// 							  .collection("score_users").orderBy("started", "desc").limit(1).get()
// 		query.forEach((score_user) => score_users.push({...score_user.data(), _id: score_user.id}));

// 		console.log(score_users[0]._id)

// 		const query2 = await db.collection("games").doc(paramID)
// 							  .collection("levels").doc("1")
// 							  .collection("score_users")
// 							  .doc(score_users[0]._id)
// 							  .collection("level_data")
// 							  .orderBy("created", "desc").limit(1).get();
		
// 		query2.forEach((level_data) => level_datas.push({...level_data.data(), bin: level_data.binary}));
// 		binary = level_datas[0].binary;
// 		res.status(200).json({binary});
// 	}
// 	catch (err) {
// 		console.error(err);
// 		res.status(500).send();
// 	}
// }
