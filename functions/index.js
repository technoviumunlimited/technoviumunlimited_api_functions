require('dotenv').config();
//  AIzaSyDT3GaLZE7ItE8glSYIaNd-XNkzIm_V9W4
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./server/models/db");
const authMiddleware = require("./server/middleware/authMiddleware");
const fetch = require('node-fetch');

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

// Check for firebase triggerse
const { Octokit } = require("@octokit/rest");

exports.firebaseTriggers = functions.firestore.document('{collection}/{docId}').onWrite(async (change, context) => {
	const octokit = new Octokit({
	auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
	request: {
		fetch
	}
	});

	try {
	const response = await octokit.repos.getContent({
		owner: process.env.GITHUB_USERNAME,
		repo: process.env.GITHUB_REPO,
		path: process.env.GITHUB_PATH
	});

	const fileContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
	const newContent = parseInt(fileContent) + 1;

	await octokit.repos.createOrUpdateFileContents({
		owner: process.env.GITHUB_USERNAME,
		repo: process.env.GITHUB_REPO,
		path: process.env.GITHUB_PATH,
		message: "Increment value in text file",
		content: Buffer.from(newContent.toString()).toString('base64'),
		sha: response.data.sha
	});
	} catch (error) {
	console.error("Error:", error);
	}
});

//exports
exports.app = functions.https.onRequest(app);

