const express = require("express");
const app = express();
const Auth = require("./routes/auth");
const getUser = require("./routes/getUser");
const addItem = require("./routes/item");
const connectDB = require("./config/db");
app.use(express.json());

//auth routes
app.use("/auth", Auth);
app.use("/api", getUser, addItem);
connectDB();
app.listen(4000, () => {
  console.log("Server listing to port 3000");
});
