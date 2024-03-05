import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/${DB_NAME}`
    );

    console.log(
      `\nDatabase connected !! DB_HOST -> ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDb connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
