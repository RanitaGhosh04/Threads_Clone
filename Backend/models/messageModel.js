import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
        // ref: "Conversation", reference will be to the conversation document
		conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		text: String,
		seen: {
			type: Boolean,
			default: false,
		},
		img: {
			type: String,
			default: "",
		},
	},

    // created at, updated at
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;