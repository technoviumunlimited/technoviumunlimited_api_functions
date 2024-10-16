const express = require("express");
const gameController = require("../controllers/gameController");
const levelController = require("../controllers/levelController");
const scoreController = require("../controllers/scoreController");
const userController = require("../controllers/userController");
const embeddedgameController = require("../controllers/embeddedgameController");
const blogsController = require("../controllers/blogsController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/"+ process.env.API_VERSION +"/games", gameController.getGames);
router.get("/"+ process.env.API_VERSION +"/games/:game_id", gameController.getGame);
router.get("/"+ process.env.API_VERSION +"/level/:game_id/levels/:level_id/", scoreController.getLevelsOfGame);
router.get("/"+ process.env.API_VERSION +"/level/:game_id", levelController.getLevelsOfGame);
router.get("/"+ process.env.API_VERSION +"/user/:user_id", authMiddleware, userController.getallUsers);
router.get("/" + process.env.API_VERSION +"/score/:game_id/users/level_data", scoreController.getLevelData)
router.get("/" + process.env.API_VERSION +"/score/:game_id/:level_id/insert", authMiddleware, scoreController.insertLevelUserScoreData)
router.get("/" + process.env.API_VERSION +"/score/:game_id/:level_id/insert/finished", authMiddleware, scoreController.insertLevelUserScoreDataFinished)
router.get("/" + process.env.API_VERSION + "/blogs", blogsController.getBlogs);
router.get("/" + process.env.API_VERSION + "/blogs/:blog_id", blogsController.getBlog);
router.get("/" + process.env.API_VERSION + "/blogscategories", blogsController.getBlogsCategories);
router.post("/" + process.env.API_VERSION +"/blogs/insert", authMiddleware, (req, res) => {
    console.log(req.user.roles )
})
router.get("/embeddedgames/:game_id", embeddedgameController.getGame);
module.exports = router;
