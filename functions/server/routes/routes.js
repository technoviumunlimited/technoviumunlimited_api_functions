const express = require("express");
const gameController = require("../controllers/gameController");
const levelController = require("../controllers/levelController");
const scoreController = require("../controllers/scoreController");
const userController = require("../controllers/userController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/"+ process.env.API_VERSION +"/games", gameController.getGames);
router.get("/"+ process.env.API_VERSION +"/level/:game_id/levels/:level_id/", scoreController.getLevelsOfGame);
router.get("/"+ process.env.API_VERSION +"/level/:game_id", levelController.getLevelsOfGame);
router.get("/"+ process.env.API_VERSION +"/user/:user_id", authMiddleware, userController.getallUsers);

module.exports = router;