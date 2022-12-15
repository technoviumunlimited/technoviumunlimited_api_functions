const db = require("../models/db");

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
