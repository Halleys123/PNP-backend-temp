import dotenv from "dotenv";
dotenv.config({ path: "secrets.env" });
dotenv.config({ path: "config.env" });
import { app } from "./app";
import mongoose from "mongoose";
import { Custom_error } from "@himanshu_guptaorg/utils";
import { startSocket } from "./startSocket";
import Razorpay from "razorpay";
import crypto from "crypto";
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_WRITE_API_KEY!
);
console.log(process.env.PORT);
const index = client.initIndex("products");
// const IP = "192.168.29.122";
// const PORT: number = process.env.PORT * 1 || 3000;
const init = async () => {
  try {
    if (!process.env.MONGO_URI)
      throw new Custom_error({
        errors: [{ message: "MONGO_URINotFound" }],
        statusCode: 500,
      });
    await mongoose.connect(process.env.MONGO_URI);
    console.log(process.env.MONGO_URI);
    app.listen(process.env.PORT, async () => {
      console.log("Server started!!!!!!");
    });
    startSocket();
  } catch (err) {
    console.error(err);
  }
};
export { razorpayInstance, index };
init();
