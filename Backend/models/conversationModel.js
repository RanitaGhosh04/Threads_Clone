import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		lastMessage: {
			text: String,
			sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			seen: {
				type: Boolean,
				default: false,
			}
		},
	},
	{ timestamps: true }
);

// pass name of the collection and conversation schema
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;