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
    const makeRegex = (val) => new RegExp(`^${val.trim()}$`, "i");

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
