import mongoose from "mongoose";

const postSchema = mongoose.Schema(
	{
        // References the User model with an ObjectId. It's required, meaning every post must be associated with a user.
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			maxLength: 500,
		},
		img: {
			type: String,
		},
		likes: {
			// array of user ids
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		replies: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				userProfilePic: {
					type: String,
				},
				username: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// mongoose.model : This is a method provided by Mongoose to create a model. A model in Mongoose represents a collection in the MongoDB database and provides an interface for interacting with that collection.

// "Post": This is the name of the model. It's also used by Mongoose to determine the name of the collection in MongoDB. For example, if you name your model "Post", Mongoose will look for a collection named "posts" in the MongoDB database (Mongoose automatically pluralizes the model name).

// postSchema: This is a schema object that defines the structure of the documents within the collection. It specifies the fields and their types, validation rules, default values, etc.

// When you use mongoose.model("Post", postSchema), Mongoose:

// Creates a model named Post based on the postSchema.
// Maps this model to a MongoDB collection named posts (or the pluralization of the model name).

const Post = mongoose.model("Post", postSchema);

export default Post;