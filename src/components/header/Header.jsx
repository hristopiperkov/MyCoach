import { Link } from "react-router";
import Navigation from "../navigation/Navigation";

export default function Header({ compact = false }) {
  return (
    <header className="site-header">
      <Link className="site-brand" to="/" aria-label="MyCoach home">
        <span className="site-monogram" aria-hidden="true">MC</span>
        <span>MyCoach</span>
      </Link>
      <Navigation compact={compact} />
    </header>
  );
}
