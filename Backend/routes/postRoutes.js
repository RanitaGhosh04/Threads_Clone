import express from "express";
import {createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost} from '../controllers/postController.js'
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);

// post id
router.get("/:id", getPost);

router.get("/user/:username", getUserPosts);

// If protectRoute calls next(), the createPost function will execute. If it does not, the request will be halted, and the response will be sent based on the middleware's logic.
router.post("/create", protectRoute, createPost);

router.delete("/:id", protectRoute, deletePost);

router.put("/like/:id", protectRoute, likeUnlikePost);

router.put("/reply/:id", protectRoute, replyToPost);


export default router; 