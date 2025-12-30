const express = require("express");
const cors = require("cors");
const insightRoutes = require("./routes/insightRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/insights", insightRoutes);

module.exports = app;
