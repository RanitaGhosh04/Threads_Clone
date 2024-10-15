import express from "express";
import {followUnFollowUser, freezeAccount, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUser} from '../controllers/userController.js'
import protectRoute from "../middlewares/protectRoute.js";
// express.Router() is a powerful feature in Express that helps manage routes and middleware in a modular and organized manner. 
const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// since we want to follow a specific user, so need id which will be dynamic

// protectRoute -> middlewear to protect the route
// (cant do any updation follow unfollow if not logged in thatswhy protectRoute)
router.post("/follow/:id", protectRoute, followUnFollowUser); //toggles state(follow/unfollow) 

router.put("/update/:id", protectRoute, updateUser);

router.put("/freeze", protectRoute, freezeAccount);

export default router;