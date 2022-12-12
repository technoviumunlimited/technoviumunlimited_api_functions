require('dotenv').config({
	path: '../.ENV',
})

const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./server/models/db");
const authMiddleware = require("./server/middleware/authMiddleware");

app.use(cors({origin: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));

const routes = require("./server/routes/routes.js");

app.use("/", routes);

app.get('/ga', (req, res) => {
	return res.status(200).send("all games here");
});
// Get games -> get()

// Get Levels -> get()

// Get Score -> get()

//exports
exports.app = functions.https.onRequest(app);