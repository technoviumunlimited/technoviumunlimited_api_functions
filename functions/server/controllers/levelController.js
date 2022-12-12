const db = require("../models/db");

exports.getLevelsOfGame = async (req, res, next) => {
	let paramID = req.params.game_id;
	try {
		const levels = [];
		const query = await db.collection("games").doc(paramID).collection('levels').get();

		query.forEach((level) => levels.push({ ...level.data(), _id: level.id }));

		res.status(200).json({ levels });
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
};

