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

// Update github file on games collection changes
exports.firebaseGamesTrigger = functions.firestore.document('games/{docId}').onWrite(async (change, context) => {
	await updateGithubFile();
});

// Update github file on blogs collection changes
exports.firebaseBlogsTrigger = functions.firestore.document('blogs/{docId}').onWrite(async (change, context) => {
	await updateGithubFile();
});

// Update github file on blogs_categories collection changes
exports.firebaseBlogsCategoriesTrigger = functions.firestore.document('blogs_categories/{docId}').onWrite(async (change, context) => {
	await updateGithubFile();
});

//exports
exports.app = functions.https.onRequest(app);

async function updateGithubFile () {
	const octokit = new Octokit({
		auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
		request: {
			fetch
		}
	});
	
	try {
	// Get repo content
	const response = await octokit.repos.getContent({
		owner: process.env.GITHUB_USERNAME,
		repo: process.env.GITHUB_REPO,
		path: process.env.GITHUB_PATH
	});

	// Get file content
	const fileContent = Buffer.from(response.data.content, 'base64').toString('utf-8');

	// Change content of file
	const newContent = parseInt(fileContent) + 1;

	// Update content of file to new content
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
}