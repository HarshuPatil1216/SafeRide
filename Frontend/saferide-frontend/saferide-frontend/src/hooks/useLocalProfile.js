import { useCallback, useEffect, useState } from "react";

/**
 * The backend has no endpoint linking a logged-in Driver/Parent user account
 * to their Driver/Parent/Vehicle records (no /me endpoint, and the relevant
 * list/search endpoints are admin-only). As a workaround, we let the person
 * enter their own IDs once (given to them by an admin) and remember them
 * locally, scoped to their account email.
 */
export function useLocalProfile(namespace, email) {
  const storageKey = `saferide_profile_${namespace}_${email || "anon"}`;

  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setProfile(raw ? JSON.parse(raw) : {});
    } catch {
      setProfile({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const save = useCallback(
    (next) => {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setProfile(next);
    },
    [storageKey]
  );

  const clear = useCallback(() => {
    localStorage.removeItem(storageKey);
    setProfile({});
  }, [storageKey]);

  return { profile, save, clear, isComplete: Object.values(profile).every((v) => v) && Object.keys(profile).length > 0 };
}
