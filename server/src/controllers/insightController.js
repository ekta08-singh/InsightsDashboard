const Insight = require("../models/Insight");

exports.getInsights = async (req, res) => {
  try {
    const {
      end_year,
      topic,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city
    } = req.query;

    const filter = {};
    const makeRegex = (val) => new RegExp(val.trim(), "i");

    if (end_year) {
      // match either start_year or end_year
      filter.$or = [
        { end_year: end_year },
        { start_year: end_year }
      ];
    }
    if (topic) filter.topic = makeRegex(topic);
    if (sector) filter.sector = makeRegex(sector);
    if (region) filter.region = makeRegex(region);
    if (pestle) filter.pestle = makeRegex(pestle);
    if (source) filter.source = makeRegex(source);
    if (swot) filter.swot = makeRegex(swot);
    if (country) filter.country = makeRegex(country);
    if (city) filter.city = makeRegex(city);

    console.log("🔎 Filter used:", filter);

    const data = await Insight.find(filter).lean();
    console.log("📊 Returned docs:", data.length);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMeta = async (req, res) => {
  try {
    const [
      endYears,
      topics,
      sectors,
      regions,
      pestles,
      sources,
      swots,
      countries,
      cities
    ] = await Promise.all([
      Insight.distinct("end_year").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("topic").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("sector").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("region").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("pestle").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("source").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("swot").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("country").then(arr => arr.filter(v => v).sort()),
      Insight.distinct("city").then(arr => arr.filter(v => v).sort())
    ]);

    const total = await Insight.countDocuments();

    res.json({
      total,
      endYears,
      topics,
      sectors,
      regions,
      pestles,
      sources,
      swots,
      countries,
      cities
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
