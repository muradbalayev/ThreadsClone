import express from 'express'
import { LikeUnlikePost, createPost, deletePost, getFeedPosts, getPost, getUserPosts, replyPost } from '../controllers/postController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();


router.get("/feed", protectRoute, getFeedPosts)
router.get("/:postId", getPost)
router.get("/user/:username", getUserPosts)
router.post("/create", protectRoute, createPost)
router.delete("/:postId", protectRoute, deletePost)
router.put("/like/:postId", protectRoute, LikeUnlikePost)
router.put("/reply/:postId", protectRoute, replyPost)

export default router;