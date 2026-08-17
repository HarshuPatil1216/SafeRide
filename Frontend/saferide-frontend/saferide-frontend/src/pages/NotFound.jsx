import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-center px-6">
      <p className="font-mono text-signal-600 text-sm mb-2">404</p>
      <h1 className="font-display text-2xl font-semibold text-navy-900 mb-2">Page not found</h1>
      <p className="text-navy-600 mb-6 max-w-sm">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn-primary">Back to SafeRide</Link>
    </div>
  );
}
