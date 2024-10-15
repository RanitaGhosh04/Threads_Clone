import jwt from "jsonwebtoken";

// This function is used to create a JWT (JSON Web Token) and set it as an HTTP-only cookie.
const generateTokenAndSetCookie = (userId, res) => {

	// Generates a JWT with the userId payload using jwt.sign(), signed with a secret (process.env.JWT_SECRET) and set to expire in 15 days.
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true, // more secure
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: "strict", // CSRF
	});

	return token;
};

export default generateTokenAndSetCookie;