import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";


async function sendMessage(req, res) {
	try {

	// If want to send this message to a reciever
	// need a reciepent id  and message which will come from frontend client
		const { recipientId, message } = req.body;
		let { img } = req.body;

	// since we are the sender
		const senderId = req.user._id;

		// we need to create a conversation if sending first message
		// but first check if this conversation exists then add more messages into that

		// find conversation between sender and reciever
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		//  we need to create a conversation if conversation doesnt exist
		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}
		
		// if we have a message as an image then upload it on cloudinary
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

	// now if we have a conversation we need to create a message
		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,

			// message that is coming from the cient
			text: message,
			img: img || "",
		});

		// update the conversation with last message, so that you can see the last message in the conversation
		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

		const recipientSocketId = getRecipientSocketId(recipientId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit("newMessage", newMessage);
		}

	// send this message to the client
		res.status(201).json(newMessage);
	} 
	catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function getMessages(req, res) {
	const { otherUserId } = req.params;
	const userId = req.user._id;
	try {

		// find the conversation between 2 users
		const conversation = await Conversation.findOne({
	 		participants: { $all: [userId, otherUserId] },
		});

		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		// after finding the conversation, find all the messages of that conversation
		const messages = await Message.find({
			conversationId: conversation._id,
			// sorted in asc order
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} 
	catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function getConversations(req, res) {
	const userId = req.user._id;
	try {
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array to show the other user's name and dp on convo list (removing current user from participants array)
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});
		res.status(200).json(conversations);
	}
	 catch (error) {
		res.status(500).json({ error: error.message });
	}
}

export { sendMessage, getMessages, getConversations };