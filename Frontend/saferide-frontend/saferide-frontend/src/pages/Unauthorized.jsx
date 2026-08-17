import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-center px-6">
      <p className="font-mono text-transit-stop text-sm mb-2">403</p>
      <h1 className="font-display text-2xl font-semibold text-navy-900 mb-2">You don't have access</h1>
      <p className="text-navy-600 mb-6 max-w-sm">Your account role doesn't allow you to view this page.</p>
      <Link to="/login" className="btn-primary">Back to sign in</Link>
    </div>
  );
}
