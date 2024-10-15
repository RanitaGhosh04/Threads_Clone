import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getConversations, getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();


// get all the conversations for the user
router.get("/conversations", protectRoute, getConversations);

router.post("/", protectRoute, sendMessage);

// get the messages between 2 users
router.get("/:otherUserId", protectRoute, getMessages);

export default router;