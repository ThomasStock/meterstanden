import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserWithMetersAndValues } from "~/server/routers/user";
import { trpc } from "~/utils/trpc";

const useUser = () => {
  // A key we found locally but that should be validated on server
  const [keyToCheck, setKeyToCheck] = useState<string>();

  // A validated, usable key
  const [user, setUser] = useState<UserWithMetersAndValues>();

  const router = useRouter();

  const onGetUser = (user: UserWithMetersAndValues) => {
    setUser(user);
    setKeyToCheck(undefined);
    // When a key is validated, store it in localStorage
    window.localStorage?.setItem("key", user.key);
  };

  const utils = trpc.useContext();
  const createUser = trpc.user.create.useMutation({
    onSuccess: onGetUser
  });

  // On mount:
  // Figure out the key: does client have one or do we ask server for a new one?
  useEffect(() => {
    if (typeof window === "undefined") {
      // Don't do anything serverside, we'll let client handle it.
      // https://nextjs.org/docs/authentication#authentication-patterns
      return;
    }

    if (user) {
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

    // 3) Ask server for a new user and set it.
    createUser.mutate();
  }, [user]);

  // When client specifies the key, we validate by getting it
  trpc.user.get.useQuery(keyToCheck!, {
    enabled: !!keyToCheck,
    onSuccess: onGetUser,
    onError: (err) => {
      console.log(err.message);

      // key is invalid, create a new user
      createUser.mutate();
    }
  });

  const logOut = () => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("logging out");
    window.localStorage?.removeItem("key");
    setUser(undefined);
    utils.meterValue.list.invalidate();
  };

  return {
    user,
    logOut
  };
};

export default useUser;

export type UseUserReturn = ReturnType<typeof useUser>;
