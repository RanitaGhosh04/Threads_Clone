import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js'
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import { v2 as cloudinary } from "cloudinary";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";
import path from "path";

// This line reads the .env file in the root of your project and adds the variables defined in it to process.env. This allows you to use these environment variables throughout your application.
dotenv.config()

//  import and invoke connectDB to ensure that your application connects to MongoDB before starting the Express server.
connectDB()

// You can access environment variables using process.env, which is a plain JavaScript object where each property corresponds to an environment variable.
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares

// When a client sends a request with JSON data in the body (e.g., from a web form or an API call), this data is sent as a string. The express.json() middleware parses this JSON string into a JavaScript object. This makes it easy to work with the data in your route handlers.
app.use(express.json({ limit: '50mb' })); // To parse JSON data in the req.body

//  This middleware parses incoming URL-encoded form data and populates req.body with it.

// extended: true: Uses the qs library to parse nested objects and arrays. This setting is more flexible for complex form data.
app.use(express.urlencoded({ extended: true })); 

// This middleware parses cookies attached to requests and populates req.cookies with the cookies as a JavaScript object.
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// http://localhost:5000 => backend,frontend

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// This starts the server and makes it listen for incoming connections on the specified port.  Server.listen for http request and handle socket server
server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))