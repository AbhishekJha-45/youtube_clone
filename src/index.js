import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => console.log("MongoDB connection failed !!! ", err));
