require('dotenv').config();
//  AIzaSyDT3GaLZE7ItE8glSYIaNd-XNkzIm_V9W4
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

app.get('/test', (req, res) => {
	return res.status(200).send("test is working");
});

app.get('/start', (req, res) => {
	return res.send("0.0.3");
});
app.get('/installer', (req, res) => {
	return res.send("0.0.1");
});
app.get("/", (req, res) => {
	return res.status(200).send("welcome to technovium unlimited api");
  });
// Get games -> get()

// Get Levels -> get()

// Get Score -> get()

//exports
exports.app = functions.https.onRequest(app);

