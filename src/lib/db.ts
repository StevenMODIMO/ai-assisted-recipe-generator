import mongoose from "mongoose";

export async function dbConnect() {
  await mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log("Database connected 🚀"))
    .catch((error) => console.log(`Database Error: ${error}`));
}
