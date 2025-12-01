function Select({ label, name, value, options = [], onChange }) {
  return (
    <div className="filter-control">
      <label className="filter-label">{label}</label>
      <select
        className="filter-select"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      >
        <option value="">All</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FiltersPanel({ meta, filters, onFilterChange }) {
  if (!meta) return <div className="sidebar">Loading filters...</div>;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">ID</div>
        <div className="sidebar-title-block">
          <div className="sidebar-title">Filter Controls</div>
          <div className="sidebar-subtitle">Slice data by year, topic, region & more.</div>
        </div>
      </div>

      <div className="sidebar-section-label">Global Filters</div>

      <div className="sidebar-filters">
        <div className="filter-group">
          <Select
            label="End Year"
            name="end_year"
            value={filters.end_year}
            options={meta.endYears}
            onChange={onFilterChange}
          />
          <Select
            label="Topic"
            name="topic"
            value={filters.topic}
            options={meta.topics}
            onChange={onFilterChange}
          />
          <Select
            label="Sector"
            name="sector"
            value={filters.sector}
            options={meta.sectors}
            onChange={onFilterChange}
          />
          <Select
            label="Region"
            name="region"
            value={filters.region}
            options={meta.regions}
            onChange={onFilterChange}
          />
          <Select
            label="PEST Category"
            name="pestle"
            value={filters.pestle}
            options={meta.pestles}
            onChange={onFilterChange}
          />
          <Select
            label="Source"
            name="source"
            value={filters.source}
            options={meta.sources}
            onChange={onFilterChange}
          />
          <Select
            label="SWOT"
            name="swot"
            value={filters.swot}
            options={meta.swots}
            onChange={onFilterChange}
          />
          <Select
            label="Country"
            name="country"
            value={filters.country}
            options={meta.countries}
            onChange={onFilterChange}
          />
          <Select
            label="City"
            name="city"
            value={filters.city}
            options={meta.cities}
            onChange={onFilterChange}
          />
        </div>
      </div>
    </aside>
  );
}
