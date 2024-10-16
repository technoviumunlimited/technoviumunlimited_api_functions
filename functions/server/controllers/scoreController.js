const { db, admin } = require("../models/db");

exports.getLevelsOfGame = async (req, res, next) => {
  let paramID = req.params.id;
  try {
    const scores = [];
    const query = await db
      .collection("games")
      .get(paramID)
      .collection("levels")
      .get();

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

    const query = await db
      .collection("games")
      .doc(paramID)
      .collection("levels")
      .doc("1")
      .collection("score_users")
      .orderBy("started", "desc")
      .limit(1)
      .get();
    query.forEach((score_user) =>
      score_users.push({ ...score_user.data(), _id: score_user.id })
    );

    console.log(score_users[0]._id);

    const query2 = await db
      .collection("games")
      .doc(paramID)
      .collection("levels")
      .doc("1")
      .collection("score_users")
      .doc(score_users[0]._id)
      .collection("level_data")
      .orderBy("created", "desc")
      .limit(1)
      .get();

    query2.forEach((level_data) =>
      level_datas.push({ ...level_data.data(), bin: level_data.binary })
    );
    binary = level_datas[0].binary;
    res.status(200).json({ binary });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.insertLevelUserScoreDataFinished = async (req, res, next) => {
  console.log("insertLevelUserScoreDataFinished");
  let gameID = req.params.game_id;
  let levelID = req.params.level_id;
  let userID = req.user.user_id;
  console.log(userID);
  console.log(gameID);
  console.log(levelID);


  try {
    const startedField = await db
      .collection("games")
      .doc(gameID)
      .collection("levels")
      .doc(levelID)
      .collection("score_users")
      .doc(userID)
      .get();
      console.log();
    if (startedField.data() && typeof startedField.data().started !== "undefined" && startedField.data().started !== null) {
      if (typeof startedField._fieldsProto.finished == "undefined" && startedField._fieldsProto.finished == null) {
        var data = {
          finished: admin.firestore.FieldValue.serverTimestamp(),
        };
        console.log(startedField._fieldsProto.started);
        await db
          .collection("games")
          .doc(gameID)
          .collection("levels")
          .doc(levelID)
          .collection("score_users")
          .doc(userID)
          .update(data);
        console.log("Record added!");
        return res.status(201).send(`user ID: ${userID}, level ID: ${levelID}, score started:`); // to do: add tiestamp
      
      } else{
        
      }
    } else {
      return res.status(200).send("You didn't even start the game");
      // await db
      //   .collection("games")
      //   .doc(gameID)
      //   .collection("levels")
      //   .doc(levelID)
      //   .collection("score_users")
      //   .doc(userID)
      //   .set({ finished: admin.firestore.FieldValue.serverTimestamp() });
      // console.log("Started field created and added timestamp");
      // return res.status(201).send();
    }

    // if (
    //   typeof startedField._fieldsProto.finished == "undefined" &&
    //   startedField._fieldsProto.finished == null
    // ) {
    //   var data = {
    //     finished: admin.firestore.FieldValue.serverTimestamp(),
    //   };

    //   console.log(startedField._fieldsProto.started);

    //   await db
    //     .collection("games")
    //     .doc(gameID)
    //     .collection("levels")
    //     .doc(levelID)
    //     .collection("score_users")
    //     .doc(userID)
    //     .update(data);
    //   console.log("Record added!");
    //   return res.status(201).send("Game lvl timestamp insert");

    //   //Show date, converted from firebase Timestamp:
    //   var x = correctTimestamp; //gets the timestamp from firebase
    //   var mydate = new Date(x);
    //   [mydate.getMonth()];
    //   [mydate.getDay()];
    //   console.log("Firebase record, date/time: " + mydate.toString());

    //   //Show date, converted from current Timestamp:
    //   var y = Date.now();
    //   var mydate = new Date(y);
    //   console.log("Current date/time: " + mydate.toString());
    // } else {
    //   console.log("No timestamp exists currently");
    //   await db
    //     .collection("games")
    //     .doc(gameID)
    //     .collection("levels")
    //     .doc(levelID)
    //     .collection("score_users")
    //     .doc(userID)
    //     .set({ finished: admin.firestore.FieldValue.serverTimestamp() });
    //   console.log("Started field created and added timestamp");
    //   return res.status(201).send();
    // }
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};

exports.insertLevelUserScoreData = async (req, res, next) => {
  let gameID = req.params.game_id;
  let levelID = req.params.level_id;
  let userID = req.user.user_id;
  console.log(userID);
  console.log(gameID);
  console.log(levelID);
  //return res.status(400).send();

  try {
    const startedField = await db
      .collection("games")
      .doc(gameID)
      .collection("levels")
      .doc(levelID)
      .collection("score_users")
      .doc(userID)
      .get();

    if (
      startedField.data() && // Controleer of er data is
      typeof startedField.data().started !== "undefined" &&
      startedField.data().started !== null
    ) {
      const seconds = startedField._fieldsProto.started.timestampValue.seconds;
      const nanos = startedField._fieldsProto.started.timestampValue.nanos;

      const nanosmath = nanos / 1000000;

      const correctTimestamp = Math.floor(seconds * 1000 + nanosmath);

      if (correctTimestamp <= Date.now() - 10000) {
        console.log(
          "Timestamp is 10 seconds or more older than the current Timestamp, posting new timestamp"
        );
        //return res.status(400).send();

        await db
          .collection("games")
          .doc(gameID)
          .collection("levels")
          .doc(levelID)
          .collection("score_users")
          .doc(userID)
          .set({ started: admin.firestore.FieldValue.serverTimestamp() });
        console.log("Record added!");
        const userDoc = await db
      .collection("games")
      .doc(gameID)
      .collection("levels")
      .doc(levelID)
      .collection("score_users")
      .doc(userID)
      .get();
      if (userDoc.exists) {   
        const data = userDoc.data();   
        const timestampInsert = data.started;
 
        if (timestampInsert && timestampInsert.toDate) {     
        // Converteer de Firestore Timestamp naar een ISO string
        const timestampString = timestampInsert.toDate().toISOString();
        console.log("Timestamp (as string):", timestampString);     
        // Stuur de timestamp-string als respons terug
        return res
        .status(201)       
        .send(`user ID: ${userID}, level ID: ${levelID}, score started: ${timestampString}`);
        } else {     
          return res.status(500).send("Timestamp was not set correctly.");
        } 
      } else{ 
          return res.status(404).send("User document not found.");
      }
      } else {
        console.log(
          "Timestamp is NOT 10 seconds or more older than the current Timestamp, no new record added to firebase"
        );
        return res
          .status(200)
          .send(
            "Timestamp is NOT 10 seconds or more older than the current Timestamp, no new record added to firebase"
          );
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
    } else {
      console.log("No timestamp exists currently");
      //return res.status(400).send();
      var timestampInsert = admin.firestore.FieldValue.serverTimestamp()
      await db
        .collection("games")
        .doc(gameID)
        .collection("levels")
        .doc(levelID)
        .collection("score_users")
        .doc(userID)
        .set({started: admin.firestore.FieldValue.serverTimestamp()});
      console.log("Started field created and added timestamp");
      
      const userDoc = await db
      .collection("games")
      .doc(gameID)
      .collection("levels")
      .doc(levelID)
      .collection("score_users")
      .doc(userID)
      .get();
      if (userDoc.exists) {   
        const data = userDoc.data();   
        const timestampInsert = data.started;
 
        if (timestampInsert && timestampInsert.toDate) {     
        // Converteer de Firestore Timestamp naar een ISO string
        const timestampString = timestampInsert.toDate().toISOString();
        console.log("Timestamp (as string):", timestampString);     
        // Stuur de timestamp-string als respons terug
        return res
        .status(201)       
        .send(`user ID: ${userID}, level ID: ${levelID}, score started: ${timestampString}`);
        } else {     
          return res.status(500).send("Timestamp was not set correctly.");
        } 
      } else{ 
          return res.status(404).send("User document not found.");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};
