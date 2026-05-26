export function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-page__header">
        <h1 className="content-area__title">About</h1>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-content-text)', marginBottom: '0.5rem' }}>
            WoodworX
          </h2>
          <p style={{ color: 'var(--color-accent)', fontWeight: 500, marginBottom: '1rem' }}>
            Version 0.1.0
          </p>
          <p style={{ lineHeight: 1.6, color: 'var(--color-content-text)' }}>
            A woodworking project management application for managing furniture designs,
            tracking projects, organizing inspiration galleries, and maintaining customer records.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-content-text)', marginBottom: '0.75rem' }}>
            Technology Stack
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <strong>Frontend:</strong> React + TypeScript (Vite)
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <strong>Backend:</strong> Express.js + TypeScript
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <strong>Database:</strong> MongoDB
            </li>
            <li style={{ padding: '0.5rem 0' }}>
              <strong>State Management:</strong> Zustand
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
