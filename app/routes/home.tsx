export function meta() {
  return [
    { title: "Bright Prints" },
    {
      name: "description",
      content:
        "Foundation build for Bright Prints, an open-source 3D print portfolio and generator platform."
    }
  ];
}

export default function Home() {
  return (
    <main className="foundation-shell">
      <section className="foundation-card">
        <p className="eyebrow">Phase 1 Foundation</p>
        <h1>Bright Prints</h1>
        <p className="lead">
          React Router 7 is in place, Railway deployment is Docker-backed, and
          the repo is ready for content schemas and private runtime boundaries.
        </p>

        <ul className="foundation-list">
          <li>Open-source-first 3D print gallery and detail experience</li>
          <li>Client-side 3mf generation for parameterized prints</li>
          <li>Future-ready creator ownership and privacy boundaries</li>
        </ul>
      </section>
    </main>
  );
}
