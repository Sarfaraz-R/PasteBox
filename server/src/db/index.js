import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv"

dotenv.config();

const connectDB=async ()=>{
    try {
        const mongoUrl = new URL(process.env.MONGODB_URL);

        // Preserve any existing query params while ensuring the database name
        // is placed in the URL path instead of after the query string.
        if (!mongoUrl.pathname || mongoUrl.pathname === "/") {
          mongoUrl.pathname = `/${DB_NAME}`;
        }

        const connectionInstance = await mongoose.connect(mongoUrl.toString());
        console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
}
export default connectDB;
