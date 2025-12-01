export default function Sidebar({ children }) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {children}
      </div>
    );
  }
  