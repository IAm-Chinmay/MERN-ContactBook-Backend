const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const { connectDB } = require("./connection");
const userRoutes = require("./Routes/userRoutes");
require("dotenv").config();

app.use(cors());
app.use(bodyparser.json());
app.get("/", (req, res) => {
  res.json({ msg: "Live" });
});

app.use("/api/user", userRoutes);

app.listen(3001, () => {
  connectDB(process.env.DB_URI);
  console.log(`Server Started at ${process.env.PORT}`);
});
