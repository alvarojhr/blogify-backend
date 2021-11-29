const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const file = require("../middleware/file");
const PostController = require("../controllers/posts");

router.get("", PostController.getPosts);
router.post("", checkAuth, file, PostController.addPost);
router.delete("/:id", checkAuth, PostController.deletePost);
router.put("/:id", checkAuth, file, PostController.updatePost);
router.get("/:id", PostController.getPost);

module.exports = router;
