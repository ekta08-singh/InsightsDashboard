import Navbar from "../components/layout/Navbar";
import FiltersPanel from "../components/filters/FiltersPanel";
import IntensityByYearChart from "../components/charts/IntensityByYearChart";
import LikelihoodByRegionChart from "../components/charts/LikelihoodByRegionChart";
import RelevanceByTopicChart from "../components/charts/RelevanceByTopicChart";
import StatCard from "../components/common/StatCard";
import { useInsightsData } from "../hooks/useInsightsData";

export default function Dashboard() {
  const { meta, filters, updateFilter, data, loading } = useInsightsData();

  const avg = (field) =>
    data.length
      ? (
          data.reduce((sum, d) => sum + (d[field] || 0), 0) / data.length
        ).toFixed(1)
      : 0;

  const avgIntensity = avg("intensity");
  const avgLikelihood = avg("likelihood");
  const avgRelevance = avg("relevance");

  return (
    <div className="app-shell">
      <FiltersPanel meta={meta} filters={filters} onFilterChange={updateFilter} />
      <main className="main">
        <Navbar />
        <div className="content-scroll">
          {loading && (
            <div style={{ marginBottom: "0.6rem" }} className="small text-muted">
              Fetching data from MongoDB…
            </div>
          )}

          <section className="stats-grid">
            <StatCard
              label="Total Records"
              value={data.length}
              meta="Based on active filters"
            />
            <StatCard
              label="Avg Intensity"
              value={avgIntensity}
              meta="How strong the reported signals are"
            />
            <StatCard
              label="Avg Likelihood"
              value={avgLikelihood}
              meta="Probability of event occurrence"
            />
            <StatCard
              label="Avg Relevance"
              value={avgRelevance}
              meta="Business impact relevance score"
            />
          </section>

          <section className="charts-grid">
            <IntensityByYearChart data={data} />
            <LikelihoodByRegionChart data={data} />
            <RelevanceByTopicChart data={data} />
          </section>
        </div>
      </main>
    </div>
  );
}
