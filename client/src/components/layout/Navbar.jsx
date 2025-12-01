export default function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-title-block">
        <div className="nav-title">Insights Analytics Dashboard</div>
        <div className="nav-subtitle">
          Interactive view of Intensity, Likelihood & Relevance across regions and topics.
        </div>
      </div>
      <div className="nav-pill">
        <span className="nav-pill-dot" />
        <span>Live MongoDB connection</span>
      </div>
    </div>
  );
}
