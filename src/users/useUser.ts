import { useEffect, useState } from "react";
import { trpc } from "~/utils/trpc";
import useLocalKey from "./useLocalKey";

const useUser = () => {
  // A key we found locally but that should be validated on server
  const { localKey, updateLocalKey } = useLocalKey();
  console.log("localkey", localKey);

  // disable SSR
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(true), []);

  const utils = trpc.useContext();

  // When client specifies the key, we validate by getting the user
  const { data: user } = trpc.user.get.useQuery(localKey, {
    enabled,
    onSuccess: (user) => {
      if (user.key !== localKey) {
        console.log("UPDATINGGG");
        updateLocalKey(user.key);
      }
    }
  });

  const logOut = () => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("logging out");
    updateLocalKey(null);
    // utils.user.get.invalidate();
  };

  return {
    user,
    logOut
  };
};

export default useUser;

export type UseUserReturn = ReturnType<typeof useUser>;
