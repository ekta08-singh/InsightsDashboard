require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Insight = require("../src/models/Insight");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected");

    const filePath = path.join(__dirname, "..", "jsondata.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    await Insight.deleteMany({});
    await Insight.insertMany(data);
    console.log("Imported:", data.length);

    await mongoose.disconnect();
    console.log("Done");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
