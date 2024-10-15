import User from "../models/userModel.js";
import jwt from "jsonwebtoken";


// if protectRoute is successfully executed, then next will perform followUnFollowUser

// This middleware function is used to protect routes, ensuring that only authenticated users can access them
const protectRoute = async (req, res, next) => {
	try {

		// we take the token
		const token = req.cookies.jwt;

		// if there is not any token it means nobody logged in -> unauthorized
		if (!token) return res.status(401).json({ message: "Unauthorized" });

		// if there is any token, we will verify that
        // decoding the jwt token and extract the user id
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find the user

        // .select("-password") to return the user, not the password
		const user = await User.findById(decoded.userId).select("-password");

        // Extracting User Information: After verifying the JWT and decoding it, the middleware retrieves the user information from the database using the userId contained in the token. This is done with User.findById(decoded.userId).select("-password"), which finds the user and excludes the password field from the result.
 
       // Attaching User to Request Object: req.user = user; assigns the retrieved user object to req.user. This attaches the user information to the req (request) object.

		req.user = user;

		// followUnFollowUser will be called
		next();
	} catch (err) {
		res.status(500).json({ message: err.message });
		console.log("Error in protectRouter: ", err.message);
	}
};

export default protectRoute;