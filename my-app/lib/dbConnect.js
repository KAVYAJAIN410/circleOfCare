import mongoose from "mongoose";

const connection = {};

export const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  } else {
    try {
      const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

      connection.isConnected = db.connections[0].readyState;
      console.log("\nConnected to database");
    } catch (error) {
      console.error("Failed to connect to database :: \n" + error);
      process.exit(1);
    }
  }
};
