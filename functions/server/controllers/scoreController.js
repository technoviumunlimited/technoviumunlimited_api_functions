const {db, admin} = require("../models/db");

exports.getLevelsOfGame = async (req, res, next) => {
    let paramID = req.params.id;
    try {
        const scores = [];
        const query = await db.collection("games").get(paramID).collection("levels").get();

        query.forEach((level) => levels.push({...level.data(), _id: level.id}));

        res.status(200).json({levels});
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
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.insertLevelUserScoreDataFinished = async (req, res, next) => {
    let gameID = req.body.game_id;
    let levelID = req.body.level_id;
    let userID = req.user.user_id;
    console.log(userID);
    console.log(gameID);
    console.log(levelID);


    // add start time and finished time to the database
    // in a array with the total time
    // do this in a top 3 with the fastest time first
    // also remove the old start time in the database

    try {

        const startedField = await db.collection("games").doc(gameID).collection("levels").doc(levelID).collection("score_users").doc(userID).get();

        if (typeof startedField._fieldsProto.started == 'undefined' && startedField._fieldsProto.started == null) {
            return res.status(200).send("You didn't even start the game");
        }


        if (typeof startedField._fieldsProto.finished == 'undefined' && startedField._fieldsProto.finished == null) {

            var data = {
                "finished": admin.firestore.FieldValue.serverTimestamp()
            }

            console.log(startedField._fieldsProto.started);

            await db.collection("games").doc(gameID).collection("levels").doc(levelID).collection("score_users").doc(userID).update(data);
            console.log("Record added!");
            return res.status(201).send("Game lvl timestamp insert");


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
        } else {
            console.log("No timestamp exists currently");
            await db.collection("games").doc(gameID).collection("levels").doc(levelID).collection("score_users").doc(userID).set({"finished": admin.firestore.FieldValue.serverTimestamp()});
            console.log("Started field created and added timestamp");
            return res.status(201).send();
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }

}

exports.insertLevelUserScoreData = async (req, res, next) => {
    let gameID = req.body.game_id;
    let levelID = req.body.level_id;
    let time = req.body.time;  // Time in MM:SS:MS format

    let userID = req.user.user_id;
    let userRoles = req.user.role;

    console.log(gameID);
    console.log(levelID);
    console.log(time);
    console.log(userID);

    // Check if there is a student role in the userRoles array
    if (userRoles.indexOf("student") === -1) {
        return res.status(403).send("You are not allowed to do this");
    } else {
        console.log("You are allowed to do this");
    }

    try {
        const userScoreRef = db.collection("games").doc(gameID).collection("levels").doc(levelID).collection("score_users").doc(userID);
        const userScoreDoc = await userScoreRef.get();

        let topTimes = [];

        if (userScoreDoc.exists) {
            topTimes = userScoreDoc.data().top_times || [];
        }

        // Convert the new time to milliseconds for comparison
        const newTimeInMs = timeStringToMilliseconds(time);

        // Convert the top times to milliseconds for comparison
        let topTimesInMs = topTimes.map(timeStringToMilliseconds);

		// Add the new time to the top times
		topTimesInMs.push(newTimeInMs);

		// Sort the top times
		topTimesInMs.sort((a, b) => a - b);

		// Keep only the top 3 times
		if (topTimesInMs.length > 3) {
			topTimesInMs = topTimesInMs.slice(0, 3);
		}

		console.log(topTimes);

		// Format the top times back to MM:SS:MS
		const topTimesFormatted = topTimesInMs.map(millisecondsToTimeString);

		console.log(topTimesFormatted);

        // Update the document with the new top times
        await userScoreRef.set({top_times: topTimesFormatted}, {merge: true});

        return res.status(201).send("Score added successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred");
    }
}

// Utility function to convert MM:SS:MS to milliseconds
function timeStringToMilliseconds(time) {
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
}

function millisecondsToTimeString(milliseconds) {
	const minutes = Math.floor(milliseconds / 60000);
	const seconds = Math.floor((milliseconds % 60000) / 1000);
	const ms = milliseconds % 1000;

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(3, '0')}`;
}
