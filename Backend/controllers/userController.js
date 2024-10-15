import User from '../models/userModel.js'
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js'
import { v2 as cloudinary } from "cloudinary";
import mongoose from 'mongoose';
import Post from "../models/postModel.js";

const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;

	try {

    let user

    // if query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}
		
		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	}
  
  catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};

const signupUser = async (req, res) => {
  try {
    // req.body is getting jspn from express.json in server.js
    const {name, email, username, password} = req.body
    const user = await User.findOne({$or:[{email},{username}]})

    if (user) {
        return res.status(400).json({ error: "User already exists" });
    }

    // hash the password

    // bcrypt, a popular library for securely handling passwords in Node.js applications.

    // The bcrypt.genSalt() method generates a salt, which is a random value added to the password before hashing it. This ensures that even if two users have the same password, their hashed passwords will be different because of the unique salts.

    // A higher number means more computational work to hash the password, making it more resistant to brute-force attacks. The number 10 is a common choice
    
    // await: bcrypt.genSalt() returns a promise, so using await allows you to wait for the promise to resolve and get the salt value before proceeding. This ensures that the salt is generated before you use it to hash the password.
    const salt = await bcrypt.genSalt(10);

    // bcrypt.hash() is a method provided by the bcrypt library used to hash passwords securely. It takes two primary arguments:

   // Password: The plain-text password that you want to hash.
   
   // Salt: A unique value used to make the hash more secure. The salt ensures that even if two users have the same password, their hashed passwords will be different.
    const hashedPassword = await bcrypt.hash(password, salt);

    // if user does not exists then create a new user
    const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword,
    });

    // save it in entire database
    await newUser.save();

    if (newUser) {
        
        res.status(201).json({

            // mongo gives id
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
            profilePic: newUser.profilePic
        });
    } else {
        // if new user not created , means data is invalid
        res.status(400).json({ error: "Invalid user data" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

const loginUser = async(req,res) => {
  try {

    // will get username and password from login data
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // check if password is correct

    // password coming from user
    // user?.password -> password present in db

    // if username is wrong means user is null. And we are trying to compare null value means with user?.password, which bcrypt doesnt support. To solve this we put "" empty string

    // bcrypt.compare is used to compare a plain-text password provided by a user with a hashed password stored in the database. 
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
	
    if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" });

	// after logging in frozen will be false
	if (user.isFrozen) {
		user.isFrozen = false;
		await user.save();
	}

    // Cookies are small pieces of data sent from the server to the browser to keep track of sessions and other information.
   // Tokens are used to identify and authenticate users. These tokens are stored in cookies for future use.

    // as the user is authenticated now , so generate token and set cookie

    // Token: A secure, encrypted piece of data used to confirm your identity.
    // Cookie: Stores the token on the client-side and sends it with each request.
    // Server Verification: Ensures that the token is valid and grants access accordingly.
    generateTokenAndSetCookie(user._id, res);

    // response on login post
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
      bio: user.bio,
      profilePic: user.profilePic
		});

		}

    
	catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in loginUser: ", error.message);
	}

}

const logoutUser = async(req,res) => {
  try {

    // es.cookie is used to set cookies on the client’s browser.
    // "jwt" is the name of the cookie (often used for storing JSON Web Tokens).
   // "" sets the cookie’s value to an empty string.
   // { maxAge: 1 } sets the cookie’s expiration time to just 1 millisecond, effectively removing it almost immediately.
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
		console.log("Error in logut: ", err.message);
	}
}

const followUnFollowUser = async (req, res) => {
	try {

    // get the user id which represents the user to be followed or unfollowed.

		const { id } = req.params;

  //  Retrieves the user who is to be followed/unfollowed (userToModify) and the currently authenticated user (currentUser) from the database. req.user._id is set by the protectRoute middleware.
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

const updateUser = async (req, res) => {

	const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body

  // userId is an object
	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

    // req.params.id -> userid coming from url
    // userId.toString() -> my userid -> needs to be stringyfy, as it is coming from mongodb as an object
    if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

    // if user wants to update password, hash it first
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

    // if the profile picture is provided from the frontend,destroy the old one and upload the new one
    if (profilePic) {

      // if dp already present
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

    // if want to update these
		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

    // save the user in database
		user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);


    // password shpuld be null in response
    user.password = null

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		// select the users in following array
		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					// means _id not equals to current userID
					_id: { $ne: userId },
				},
			},
			{
				// give us size of 10 users
				$sample: { size: 10 },
			},
		]);

		// filter out the users that we do not follow
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));

		// give 4 users that we dont follow 0 to 3
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const freezeAccount = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		user.isFrozen = true;
		await user.save();

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { signupUser,loginUser,logoutUser,followUnFollowUser,updateUser,getUserProfile,getSuggestedUsers,freezeAccount };
