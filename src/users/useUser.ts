import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/trpc";

const useUser = () => {
  // A key we found locally but that should be validated on server
  const [keyToCheck, setKeyToCheck] = useState<string>();

  // A validated, usable key
  const [key, setKey] = useState<string>();

  const router = useRouter();

  const utils = trpc.useContext();
  const getKey = trpc.user.create.useMutation();

  // On mount:
  // Figure out the key: does client have one or do we ask server for a new one?
  useEffect(() => {
    if (typeof window === "undefined") {
      // Don't do anything serverside, we'll let client handle it.
      // https://nextjs.org/docs/authentication#authentication-patterns
      return;
    }

    if (key) {
      return;
    }

    // 1) http://foo.com/ab123 always uses key ab123
    const keyFromQuery = router.query?.userKey?.[0];
    if (keyFromQuery) {
      setKeyToCheck(keyFromQuery);
      return;
    }

    // 2) Check if there is a key in localStorage and use that one
    const localKey = window.localStorage?.getItem("key");
    if (localKey) {
      setKeyToCheck(localKey);
      return;
    }

    // 3) Ask server for a new key and set it.
    getKey.mutateAsync().then((key) => {
      setKey(key);
    });
  }, [key]);

  // When client specifies the key, we validate
  trpc.user.check.useQuery(keyToCheck!, {
    enabled: !!keyToCheck,
    onSuccess: (userCheckedAndOk) => {
      if (userCheckedAndOk) {
        setKey(keyToCheck);
        setKeyToCheck(undefined);
        // When a key is validated, store it in localStorage
        window.localStorage?.setItem("key", keyToCheck!);
      }
    }
  });

  const logOut = () => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("logging out");
    window.localStorage?.removeItem("key");
    setKey(undefined);
    utils.meterValue.list.invalidate();
  };

  return {
    key,
    logOut
  };
};

export default useUser;

export type UseUserReturn = ReturnType<typeof useUser>;
