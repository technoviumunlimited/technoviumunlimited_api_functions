const { db } = require("../models/db");

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





exports.userInsertLevel = async (req, res, next) => {

    let gameID = req.params.game_id;

    let levelID = req.params.level_id;

    let userID = req.params.token;

    try {



        //check if token valid



        //get from token user id
		
       

        //insert in database



        const levels = [];

        const query = await db.collection("games").doc(paramID).collection('levels').get();



        query.forEach((level) => levels.push({ ...level.data(), _id: level.id }));



        res.status(200).json({ levels });

    } catch (err) {

        console.error(err);

        res.status(500).send();

    }

};

