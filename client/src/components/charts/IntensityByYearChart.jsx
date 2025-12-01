import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function IntensityByYearChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!data || data.length === 0) return;

    const width = 480;
    const height = 260;
    const margin = { top: 20, right: 24, bottom: 40, left: 40 };

    // group by year and compute avg intensity
    const byYear = d3.rollup(
      data,
      (v) => d3.mean(v, (d) => d.intensity || 0),
      (d) => d.start_year || d.end_year || "Unknown"
    );

    const entries = Array.from(byYear, ([year, value]) => ({
      year,
      value,
    }))
      .filter((d) => d.year && d.year !== "Unknown")
      .sort((a, b) => +a.year - +b.year);

    if (!entries.length) return;

    const x = d3
      .scaleBand()
      .domain(entries.map((d) => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(entries, (d) => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // background
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent");

    // grid
    svg
      .append("g")
      .attr("class", "chart-grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat("")
      )
      .selectAll("line")
      .attr("opacity", 0.25);

    svg
      .append("g")
      .attr("class", "chart-grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat("")
      )
      .selectAll("line")
      .attr("opacity", 0.25);

    // axes
    svg
      .append("g")
      .attr("class", "chart-axis chart-tick")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("class", "chart-axis chart-tick")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    // line generator
    const line = d3
      .line()
      .x((d) => x(d.year) + x.bandwidth() / 2)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // line (gold / orange like Vuexy)
    svg
      .append("path")
      .datum(entries)
      .attr("class", "chart-line")
      .attr("stroke", "#fbbf24")
      .attr("d", line);

    // points
    svg
      .append("g")
      .selectAll("circle")
      .data(entries)
      .enter()
      .append("circle")
      .attr("class", "chart-point")
      .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#facc15");
  }, [data]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Average Intensity by Year</div>
          <div className="chart-subtitle">
            Year-wise strength of reported signals.
          </div>
        </div>
        <div className="chart-badge">Line · Intensity</div>
      </div>
      <svg ref={svgRef} className="chart-svg" viewBox="0 0 480 260" />
    </div>
  );
}
