// Here created a socket server which is in the backend

import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js"
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);

// we need to store userId in our server
const userSocketMap = {}; // userId: socketId

// creating socket server and binding it with http server, so that socket server can handle http requests
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

// get the socketId of the user
export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};

io.on("connection", (socket) => {
	console.log("user connected", socket.id);

	// userId which we are getting from client SocketContext.jsx
	const userId = socket.handshake.query.userId;

	// store userid in the hashmap
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// taking keys userSocketMap and converting it into array of userID
	// we are sending this event to the client(every user)
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// when the user has seen the messages
	socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
		try {

			// if seen is false, make it true
			await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
			
			// update the converation also with blue tick
			await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });

			// sending this event to client
			io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
		} catch (error) {
			console.log(error);
		}
	});

	// disconnect the socket
	socket.on("disconnect", () => {
		console.log("user disconnected",socket.id);

		// once disconnected, delete the userId from map
		delete userSocketMap[userId];

		// the send again to client and update the socket map
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, server, app };