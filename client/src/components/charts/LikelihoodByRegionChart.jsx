import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LikelihoodByRegionChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!data || data.length === 0) return;

    const width = 480;
    const height = 260;
    const margin = { top: 20, right: 40, bottom: 20, left: 20 };

    const cx = width / 2 - 30; // center x
    const cy = height / 2 + 10; // center y
    const outerRadius = 95;
    const innerRadius = 55;

    // --- aggregate avg likelihood by region ---
    const byRegion = d3.rollup(
      data,
      v => d3.mean(v, d => d.likelihood || 0),
      d => d.region || "Unknown"
    );

    let entries = Array.from(byRegion, ([region, value]) => ({ region, value }))
      .filter(d => d.region && d.region !== "Unknown" && d.value != null)
      .sort((a, b) => b.value - a.value);

    if (!entries.length) return;

    // keep top 6 regions, group rest as "Others"
    const top = entries.slice(0, 6);
    if (entries.length > 6) {
      const rest = entries.slice(6);
      const restAvg =
        rest.reduce((s, d) => s + d.value, 0) / (rest.length || 1);
      top.push({ region: "Others", value: restAvg });
    }
    entries = top;

    const total = d3.sum(entries, d => d.value);
    const color = d3
      .scaleOrdinal()
      .domain(entries.map(d => d.region))
      .range(["#22d3ee", "#a855f7", "#f97316", "#22c55e", "#3b82f6", "#f43f5e", "#eab308"]);

    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.value);

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(5);

    const arcs = pie(entries);

    // background
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent");

    const g = svg.append("g").attr("transform", `translate(${cx},${cy})`);

    // donut slices
    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.region))
      .attr("stroke", "#020617")
      .attr("stroke-width", 1.2)
      .append("title")
      .text(
        d =>
          `${d.data.region}: ${d.data.value.toFixed(2)} ( ${( (d.data.value / total) * 100).toFixed(1)}% )`
      );

    // center text
    const avgLikelihood =
      entries.reduce((s, d) => s + d.value, 0) / (entries.length || 1);

    g.append("text")
      .attr("class", "donut-center-main")
      .attr("text-anchor", "middle")
      .attr("y", -4)
      .text(avgLikelihood.toFixed(1));

    g.append("text")
      .attr("class", "donut-center-sub")
      .attr("text-anchor", "middle")
      .attr("y", 14)
      .text("Avg likelihood");

    // legend on the right
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 120}, ${margin.top + 8})`
      );

    const legendItems = legend
      .selectAll("g")
      .data(entries)
      .enter()
      .append("g")
      .attr("transform", (_, i) => `translate(0, ${i * 18})`);

    legendItems
      .append("circle")
      .attr("r", 5)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", d => color(d.region));

    legendItems
      .append("text")
      .attr("x", 12)
      .attr("y", 4)
      .attr("font-size", 10)
      .attr("fill", "#d1d5db")
      .text(
        d =>
          `${d.region} · ${d.value.toFixed(1)}`
      );
  }, [data]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Likelihood by Region (Donut)</div>
          <div className="chart-subtitle">
            Average likelihood score, grouped by region.
          </div>
        </div>
        <div className="chart-badge">Donut · Likelihood</div>
      </div>
      <svg ref={svgRef} className="chart-svg" viewBox="0 0 480 260" />
    </div>
  );
}
