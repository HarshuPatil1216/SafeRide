import { useEffect, useState } from "react";

export function useOptions(api, mapper, deps = []) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .list({ page: 0, size: 100, sortBy: "id", sortDir: "asc" })
      .then((res) => {
        if (!cancelled) setOptions((res.content || []).map(mapper));
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { options, loading };
}
