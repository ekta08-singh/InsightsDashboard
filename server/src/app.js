const express = require("express");
const cors = require("cors");
const insightRoutes = require("./routes/insightRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/insights", insightRoutes);

module.exports = app;
