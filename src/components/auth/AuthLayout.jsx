import "./Auth.css";

const activities = [
  { name: "Strength", path: "M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" },
  { name: "Running", path: "M14 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 8l4-2 3 5 4 1M13 7l-3 7 5 3-1 5M10 14l-4 6H2M9 8l-3 4" },
  { name: "Cycling", path: "M8 17a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm16 0a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM4 17l5-9 5 9H4M9 8h9l2 9M7 5h4M16 4h3l-1 4" },
  { name: "Wellbeing", path: "M20 3C9 2 3 8 5 15c2 7 15 5 15-12ZM5 21 16 9" },
];

export default function AuthLayout({ children }) {
  return (
    <main className="auth-scene">
      <div className="auth-story">
        <span className="auth-story__eyebrow">A stronger you starts here</span>
        <h1>Your next chapter starts with movement.</h1>
        <p>Find your coach. Build healthy habits. Move together.</p>
        <ul className="auth-activities" aria-label="Activities">
          {activities.map(({ name, path }) => (
            <li key={name}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </main>
  );
}
