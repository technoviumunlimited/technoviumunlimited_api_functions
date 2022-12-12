const db = require("../models/db");

exports.getallUsers = async (req, res, next) => {
	try {
		const users = [];
		
		const query = await db.collection("users").get();
		query.forEach((user) => users.push({ ...user.data(), _id: user.id }));
		res.status(200).json({ users });
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
};