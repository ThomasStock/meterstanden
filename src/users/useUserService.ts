import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const useUserService = () => {
  const key = useState<string | null>(
    typeof window !== "undefined" ? window.localStorage?.getItem("key") : null
  );

  useEffect(() => {
    console.log("use effect", key);
    if (!key) {
      localStorage.setItem("key", DateTime.now().toISO());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    key
  };
};

export default useUserService;
