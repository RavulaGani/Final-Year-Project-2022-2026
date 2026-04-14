const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/UserRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// ✅ Only ONE DB connection
connectDB();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoutes);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});