const { db } = require("../models/db");

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
	let gameID = req.params.game_id;
	let levelID = req.params.level_id;
	let userID = req.user.user_id;
	console.log(userID);
	
	console.log(req.body)
	//return res.status(500).json(req.body);
	
		const data = {
			gameID: scenario.scenario.gameID,
			levelID: scenario.scenario.levelID,
			userID: scenario.scenario.userID,
		};
		// games game_id levels, level_id, score_users user_id -> created finished
		await db.collection("games/HEAryAXZyQgzqa5AOoey/levels/1/").doc(scenario.scenario.gameID).set(data);
	}
	
	exports.functionName =
		functions.https.onRequest(async (request, response) => {
			
			try {
			
				const scenario = await fetchScenarioJSON(request.query.gameID);
				if (typeof scenario === "string") {
					if (scenario.includes("not valid json")) {
						response.send("not valid json");
					}
				} else {
					await addDataToFirestore(scenario);  // See the await here
					response.send(`Done! Added scenario with ID ${request.query.gameID} to the app database.`);
				}
			} catch (error) {
				// ...
			}
	
		});

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
