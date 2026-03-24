import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST be first

import mongoose from "mongoose";
import app from "./app.js";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
