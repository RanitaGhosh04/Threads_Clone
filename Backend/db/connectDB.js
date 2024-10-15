import mongoose from "mongoose";

const connectDB = async () => {
	try {

        // This line attempts to connect to the MongoDB database using the connection string stored in process.env.MONGO_URI. The await keyword ensures that the code waits for the connection to complete before proceeding.
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			// To avoid warnings in the console
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1)
	}
};

export default connectDB;