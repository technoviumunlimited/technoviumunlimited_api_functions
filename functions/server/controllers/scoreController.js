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