import { useCallback, useEffect, useRef, useState } from "react";

export function useResourceList(api, { pageSize = 10, sortBy = "id", sortDir = "asc" } = {}) {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  const fetchData = useCallback(
    async (targetPage, targetQuery) => {
      setLoading(true);
      setError("");
      try {
        const result = targetQuery
          ? await api.search({ query: targetQuery, page: targetPage, size: pageSize, sortBy, sortDir })
          : await api.list({ page: targetPage, size: pageSize, sortBy, sortDir });
        setData(result);
      } catch (err) {
        setError(err.message || "Couldn't load records.");
      } finally {
        setLoading(false);
      }
    },
    [api, pageSize, sortBy, sortDir]
  );

  useEffect(() => {
    fetchData(page, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearchChange(value) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      fetchData(0, value);
    }, 350);
  }

  function refresh() {
    fetchData(page, query);
  }

  return {
    rows: data.content || [],
    page,
    totalPages: data.totalPages || 0,
    totalElements: data.totalElements || 0,
    pageSize,
    setPage,
    query,
    onSearchChange: handleSearchChange,
    loading,
    error,
    refresh,
  };
}
