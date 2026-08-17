import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notificationsApi } from "../../api/notifications";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { useToast } from "../../hooks/useToast";
import { formatDateTime, titleCase } from "../../utils/formatters";

export default function ParentNotifications() {
  const { user } = useAuth();
  const { profile, isComplete } = useLocalProfile("parent", user?.email);
  const toast = useToast();

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [unreadCount, setUnreadCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    if (!isComplete) return;
    setLoading(true);
    setError("");
    const call = unreadOnly ? notificationsApi.unreadByParent : notificationsApi.byParent;
    call(profile.parentId, { page, size: 10 })
      .then(setData)
      .catch((err) => setError(err.message || "Couldn't load your notifications."))
      .finally(() => setLoading(false));

    notificationsApi
      .unreadCount(profile.parentId)
      .then((res) => setUnreadCount(typeof res === "number" ? res : res.count))
      .catch(() => {});
  }

  useEffect(load, [unreadOnly, page, isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleMarkRead(id) {
    try {
      await notificationsApi.markAsRead(id);
      toast.success("Marked as read.");
      load();
    } catch (err) {
      toast.error(err.message || "Couldn't mark as read.");
    }
  }

  if (!isComplete) {
    return (
      <div className="card p-6 text-center">
        <p className="text-navy-800 font-medium mb-3">Set up your Parent ID first to see your notifications.</p>
        <Link to="/parent/setup" className="btn-primary inline-flex">
          Go to My IDs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-navy-900">Notifications</h2>
          {unreadCount !== null && (
            <p className="text-sm text-navy-600 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-navy-900/25"
            checked={unreadOnly}
            onChange={(e) => {
              setPage(0);
              setUnreadOnly(e.target.checked);
            }}
          />
          Unread only
        </label>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading notifications" />
        ) : error ? (
          <div className="p-4">
            <ErrorMessage message={error} onRetry={load} />
          </div>
        ) : data.content.length === 0 ? (
          <div className="p-4">
            <EmptyState title="No notifications" description="You'll see ride and pickup alerts here." />
          </div>
        ) : (
          <>
            <ul className="divide-y divide-navy-900/5">
              {data.content.map((n) => (
                <li key={n.id} className={`p-4 flex items-start justify-between gap-4 ${!n.readStatus ? "bg-signal-500/[0.04]" : ""}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {!n.readStatus && <span className="h-2 w-2 rounded-full bg-signal-500" aria-hidden="true" />}
                      <p className="font-semibold text-navy-900">{n.title}</p>
                      <span className="text-xs font-medium text-navy-500 bg-navy-900/5 rounded-full px-2 py-0.5">
                        {titleCase(n.type)}
                      </span>
                    </div>
                    <p className="text-sm text-navy-700">{n.message}</p>
                    <p className="text-xs text-navy-500 mt-1">{formatDateTime(n.createdAt)}</p>
                  </div>
                  {!n.readStatus && (
                    <button className="btn-ghost px-3 py-1.5 shrink-0" onClick={() => handleMarkRead(n.id)}>
                      Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements} pageSize={10} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
