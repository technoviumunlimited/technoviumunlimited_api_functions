const { db, storage } = require("../models/db");

exports.getGames = async (req, res, next) => {
	try {
		const options = {
			version: 'v4',
			action: 'read',
			expires: Date.now() + 15 * 60 * 1000, // 15 minutes
		};

		const query = await db.collection("games").orderBy('position').get();
		const data = query.docs.map(doc => ({id: doc.id, ...doc.data()}));
		const games = await Promise.all(data.map(async (game) => {
			const thumb =  await storage
				.bucket('technoviumunlimited.appspot.com')
				.file('games/' + game.id + "/thumb.png")
				.getSignedUrl(options);

				return new Promise((resolve, reject) => {
					return resolve({
						_id: game.id, 
						_thumb: thumb, 
						name: game.name, 
						category: game.category, 
						created_by: game.created_by,
						created: game.created,
						position: game.position,
					})
				});
		}));
		res.status(200).json({ games });
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
};

exports.getGame = async (req, res, next) => {
	let paramID = req.params.game_id;
	const options = {
		version: 'v4',
		action: 'read',
		expires: Date.now() + 15 * 60 * 1000, // 15 minutes
	};

	try {
		const data_gz = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.data")
			.getSignedUrl(options);

		const framework_js_gz = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.framework.js")
			.getSignedUrl(options);


		const loader_js = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.loader.js")
			.getSignedUrl(options);

		const wasm_gz = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.wasm")
			.getSignedUrl(options);

		const game = [];
		const query = await db.collection("games").doc(paramID).get();
		game.push({ ...query.data(), _id: query.id, _data_gz: data_gz, _framework_js_gz: framework_js_gz, _loader_js: loader_js, _wasm_gz: wasm_gz });


		// Get a v4 signed URL for reading the file

		//file_path = await storage
		//	 .file('technoviumunlimited.appspot.com' +'/games/' + paramID + "/game.data.gz")
		//	 .getDownloadURL();
		//console.log(file_path);
		/*let url = await 
						firebase.storage()
						.ref('Audio/English/United_States-OED-' + i +'/' + $scope.word.word + ".mp3")
						.getDownloadURL();
*/
		res.status(200).json({ game });
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
};