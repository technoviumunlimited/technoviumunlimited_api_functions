const db = require("../models/db");

exports.getGames = async (req, res, next) => {
	var_dump(paramID);
	try {
		const games = [];
		const query = await db.collection("games").get();
		query.forEach((game) => games.push({ ...game.data(), _id: game.id }));

		res.status(200).json({ games });
	} catch (err) {
		console.error(err);

		res.status(500).send();
	}
};