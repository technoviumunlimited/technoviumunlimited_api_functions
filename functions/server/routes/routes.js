const express = require("express");
const { body, validationResult } = require('express-validator');
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
router.post("/" + process.env.API_VERSION +"/score/insert", authMiddleware, scoreController.insertLevelUserScoreData)
router.post("/" + process.env.API_VERSION +"/score/insert/finished", authMiddleware, scoreController.insertLevelUserScoreDataFinished)
// router.get("/" + process.env.API_VERSION + "/blogs", blogsController.getBlogs);
// router.get("/" + process.env.API_VERSION + "/blogs/:blog_id", blogsController.getBlog);
// router.get("/" + process.env.API_VERSION + "/blogscategories", blogsController.getBlogsCategories);


const validateInsertBlog = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('active').isBoolean().withMessage('Active must be a boolean value'),
    // Add more validation rules as needed for each field
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status (400).json({ errors: errors.array() });
    }
    next();
    },
    ];
    

router.post("/" + process.env.API_VERSION + "/blogs/insert", authMiddleware, validateInsertBlog , blogsController.insert);
router.get("/" + process.env.API_VERSION + "/blogs/getBlogs", authMiddleware, blogsController.getBlogs);
router.put("/" + process.env.API_VERSION + "/blogs/update/:blog_id", authMiddleware, validateInsertBlog, blogsController.updateBlog);
router.delete("/" + process.env.API_VERSION + "/blogs/delete/:blog_id", authMiddleware, blogsController.deleteBlog);


router.get("/embeddedgames/:game_id", embeddedgameController.getGame);
module.exports = router;
