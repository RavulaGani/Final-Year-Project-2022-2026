const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/UserRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
connectDB();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoutes);

app.listen(8080, () => {
  console.log("Server running");
});
