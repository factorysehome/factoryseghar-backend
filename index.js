const express = require("express");
const cors = require("cors");
const app = express();
const Auth = require("./routes/auth");
const getUser = require("./routes/getUser");
const addItem = require("./routes/item");
const address = require("./routes/address");
const connectDB = require("./config/db");
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

//auth routes
app.use("/auth", Auth);
app.use("/api", getUser, addItem, address);
connectDB();
app.listen(4000, () => {
  console.log("Server listing to port 4000");
});
