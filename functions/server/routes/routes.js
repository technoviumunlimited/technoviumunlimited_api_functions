const express = require("express");
const gameController = require("../controllers/gameController");
const levelController = require("../controllers/levelController");
const scoreController = require("../controllers/scoreController");
const userController = require("../controllers/userController");
const embeddedgameController = require("../controllers/embeddedgameController");
const blogsController = require("../controllers/blogsController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/" + process.env.API_VERSION + "/games/add", authMiddleware, (req, res) => {
    if (req.user.permissions.includes('add_game')) {
      // Gebruiker heeft toestemming om een game toe te voegen
      gameController.addGame(req, res); // Roep de gameController.addGame functie aan
    } else {
      // Gebruiker heeft geen toestemming
      res.status(403).json({ message: 'Permission denied!' });
    }
  });
  

router.get("/"+ process.env.API_VERSION +"/games", gameController.getGames);
router.get("/"+ process.env.API_VERSION +"/games/:game_id", gameController.getGame);
router.get("/"+ process.env.API_VERSION +"/level/:game_id/levels/:level_id/", scoreController.getLevelsOfGame);
router.get("/"+ process.env.API_VERSION +"/level/:game_id", levelController.getLevelsOfGame);
router.get("/"+ process.env.API_VERSION +"/user_groep1/:user_id", authMiddleware, userController.getallUsers);
router.get("/"+ process.env.API_VERSION +"/user/:user_id", authMiddleware, userController.getallUsers);
router.get("/" + process.env.API_VERSION +"/score/:game_id/users/level_data", scoreController.getLevelData)
router.post("/" + process.env.API_VERSION +"/score/insert", authMiddleware, scoreController.insertLevelUserScoreData)
router.post("/" + process.env.API_VERSION +"/score/insert/finished", authMiddleware, scoreController.insertLevelUserScoreDataFinished)
router.get("/" + process.env.API_VERSION + "/blogs", blogsController.getBlogs);
router.get("/" + process.env.API_VERSION + "/blogs/:blog_id", blogsController.getBlog);
router.get("/" + process.env.API_VERSION + "/blogscategories", blogsController.getBlogsCategories);
router.get("/embeddedgames/:game_id", embeddedgameController.getGame);
module.exports = router;
