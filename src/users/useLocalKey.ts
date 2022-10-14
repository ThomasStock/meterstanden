import { useRouter } from "next/router";
import { useState } from "react";
/**
 * Reads a 'user key' from local storage or the url and returns it.
 * Stores/updates a 'user key' in local storage.
 */
const useLocalKey = () => {
  const router = useRouter();

  const [localKey, setLocalKey] = useState(() => {
    const keyFromQuery = router.query?.userKey?.[0];

    // 1) http://foo.com/ab123 always uses key ab123
    if (keyFromQuery) {
      return keyFromQuery;
    }

    // 2) Check if there is a key in localStorage and use that one

    if (typeof window === "undefined") {
      // https://nextjs.org/docs/authentication#authentication-patterns
      return;
    }

    const keyFromLocalStorage = window.localStorage?.getItem("key");
    return keyFromLocalStorage ?? undefined;
  });

  const updateLocalKey = (newKey: string | null) => {
    if (!newKey) {
      window.localStorage?.removeItem("key");
      setLocalKey(undefined);
      return;
    }
    window.localStorage?.setItem("key", newKey);
    setLocalKey(newKey);
  };

  return {
    localKey,
    updateLocalKey
  };
};

export default useLocalKey;
