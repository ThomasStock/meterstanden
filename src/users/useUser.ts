import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { UserWithMetersAndValues } from "~/server/routers/user";
import { trpc } from "~/utils/trpc";

const useUser = () => {
  // A key we found locally but that should be validated on server
  const [keyToCheck, setKeyToCheck] = useState<string>();

  const router = useRouter();

  const onGetUser = (user: UserWithMetersAndValues) => {
    // When a key is validated, store it in localStorage
    window.localStorage?.setItem("key", user.key);
  };

  const utils = trpc.useContext();

  // When client specifies the key, we validate by getting it
  const { data: user } = trpc.user.get.useQuery(keyToCheck!, {
    enabled: !!keyToCheck,
    onSuccess: (user) => {
      if (user) {
        onGetUser(user);
        return;
      }

      // key is invalid, create a new user
      createUser.mutate();
    }
  });

  const createUser = trpc.user.create.useMutation({
    onSuccess: (createdUser) => {
      utils.user.get.setData(createdUser);
      setKeyToCheck(user?.key);
    }
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
  }, []);

  const logOut = async () => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("logging out");
    window.localStorage?.removeItem("key");
    setKeyToCheck(undefined);
    await utils.user.get.invalidate();
  };

  return {
    user,
    keyToCheck,
    logOut
  };
};

export default useUser;

export type UseUserReturn = ReturnType<typeof useUser>;
