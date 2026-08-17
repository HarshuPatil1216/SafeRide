import { useState } from "react";
import { searchApi } from "../../api/search";
import { Input } from "../../components/ui/FormControls";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await searchApi.search(query.trim());
      setResults(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="card p-4 flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students, parents, drivers, vehicles, routes…"
          className="flex-1"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {loading ? (
        <LoadingSpinner label="Searching the network" />
      ) : error ? (
        <ErrorMessage message={error} onRetry={handleSubmit} />
      ) : !searched ? (
        <EmptyState title="Search across SafeRide" description="Find students, parents, drivers, vehicles, and routes by name or number." />
      ) : results.length === 0 ? (
        <EmptyState title="No matches" description={`Nothing found for "${query}".`} />
      ) : (
        <div className="card divide-y divide-navy-900/5">
          {results.map((r, i) => (
            <div key={`${r.type}-${r.id || i}`} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-navy-900">{r.title || r.name}</p>
                {r.subtitle && <p className="text-sm text-navy-600">{r.subtitle}</p>}
              </div>
              {r.type && (
                <span className="text-xs font-semibold uppercase tracking-wide text-navy-500 bg-navy-900/5 rounded-full px-2.5 py-1 shrink-0">
                  {r.type}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
