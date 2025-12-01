import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function RelevanceByTopicChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!data || data.length === 0) return;

    const width = 480;
    const height = 260;
    const margin = { top: 26, right: 30, bottom: 40, left: 90 };

    // --- prepare data: topic x year, avg relevance ---
    const rows = data.filter(
      (d) =>
        d.topic &&
        d.topic !== "" &&
        (d.start_year || d.end_year) &&
        d.relevance != null
    );

    if (!rows.length) return;

    // choose a year (start_year preferred, else end_year)
    const processed = rows.map((d) => ({
      topic: d.topic,
      year: d.start_year || d.end_year,
      relevance: d.relevance,
    }));

    // top N topics by count so heatmap stays readable
    const topicCount = d3.rollup(
      processed,
      (v) => v.length,
      (d) => d.topic
    );

    const topTopics = Array.from(topicCount, ([topic, count]) => ({
      topic,
      count,
    }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7) // show top 7 topics
      .map((d) => d.topic);

    const filtered = processed.filter((d) => topTopics.includes(d.topic));

    // aggregate avg relevance per (topic, year)
    const cellMap = d3.rollup(
      filtered,
      (v) => d3.mean(v, (d) => d.relevance),
      (d) => d.topic,
      (d) => d.year
    );

    const years = Array.from(
      new Set(filtered.map((d) => d.year))
    ).sort((a, b) => +a - +b);

    const topics = topTopics;

    const cells = [];
    for (const topic of topics) {
      for (const year of years) {
        const val = cellMap.get(topic)?.get(year);
        if (val != null) {
          cells.push({ topic, year, value: val });
        }
      }
    }

    if (!cells.length) return;

    const maxValue = d3.max(cells, (d) => d.value) || 1;

    const x = d3
      .scaleBand()
      .domain(years)
      .range([margin.left, width - margin.right])
      .padding(0.05);

    const y = d3
      .scaleBand()
      .domain(topics)
      .range([margin.top, height - margin.bottom])
      .padding(0.15);

    const color = d3
      .scaleSequential(d3.interpolateInferno) // nice contrast on dark bg
      .domain([0, maxValue]);

    // background
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent");

    // axes
    svg
      .append("g")
      .attr("class", "chart-axis chart-tick")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("class", "chart-axis chart-tick")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0));

    // heatmap cells
    svg
      .append("g")
      .selectAll("rect")
      .data(cells)
      .enter()
      .append("rect")
      .attr("class", "heatmap-rect")
      .attr("x", (d) => x(d.year))
      .attr("y", (d) => y(d.topic))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", (d) => color(d.value));

    // optional: show value for strong cells
    svg
      .append("g")
      .selectAll("text")
      .data(cells.filter((d) => d.value >= maxValue * 0.6))
      .enter()
      .append("text")
      .attr("x", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.topic) + y.bandwidth() / 2 + 3)
      .attr("text-anchor", "middle")
      .attr("font-size", 9)
      .attr("fill", "#f9fafb")
      .text((d) => d.value.toFixed(1));

    // simple color legend
    const legendWidth = 120;
    const legendHeight = 8;
    const legendX = width - margin.right - legendWidth;
    const legendY = margin.top - 18;

    const legend = svg.append("g").attr("transform", `translate(${legendX},${legendY})`);

    const gradientId = "relevance-heatmap-gradient";
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    d3.range(0, 1.01, 0.1).forEach((t) => {
      gradient
        .append("stop")
        .attr("offset", `${t * 100}%`)
        .attr("stop-color", color(t * maxValue));
    });

    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("rx", 4)
      .attr("fill", `url(#${gradientId})`);

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", legendHeight + 10)
      .attr("font-size", 9)
      .attr("fill", "#9ca3af")
      .text("Low relevance");

    legend
      .append("text")
      .attr("x", legendWidth)
      .attr("y", legendHeight + 10)
      .attr("font-size", 9)
      .attr("fill", "#9ca3af")
      .attr("text-anchor", "end")
      .text("High relevance");
  }, [data]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Relevance Heatmap</div>
          <div className="chart-subtitle">
            Average relevance for top topics across years.
          </div>
        </div>
        <div className="chart-badge">Heatmap · Relevance</div>
      </div>
      <svg ref={svgRef} className="chart-svg" viewBox="0 0 480 260" />
    </div>
  );
}
