import { useEffect, useState } from "react";
import { trpc } from "~/utils/trpc";

const useUser = () => {
  const [key, setKey] = useState<string>();

  const getKey = trpc.user.create.useMutation();

  useEffect(() => {
    if (typeof window === "undefined") {
      // Don't do anything serverside, we'll let client handle it.
      // https://nextjs.org/docs/authentication#authentication-patterns
      return;
    }

    const localKey = window.localStorage?.getItem("key");

    console.log({ localKey });

    if (localKey) {
      setKey(localKey);
      return;
    }

    if (!key) {
      console.log("getting a key");
      getKey.mutateAsync().then((key) => {
        setKey(key);
        window.localStorage?.setItem("key", key);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage?.removeItem("key");
    }
  };

  return {
    key,
    logOut
  };
};

export default useUser;

export type UseUserReturn = ReturnType<typeof useUser>;
