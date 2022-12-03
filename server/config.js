import { config } from "dotenv";
config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://adm:AK7T3Pw8dLWSF73x@cluster0.cwfiafk.mongodb.net/?retryWrites=true&w=majority";

export const PORT = process.env.PORT || 4000;