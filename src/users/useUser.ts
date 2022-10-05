import { trpc } from "~/utils/trpc";
import useLocalKey from "./useLocalKey";

const useUser = () => {
  // A key we found locally but that should be validated on server
  const { localKey, updateLocalKey } = useLocalKey();
  console.log("localKey in useUser", localKey);

  // When client specifies the key, we validate by getting the user
  const { data: user } = trpc.user.get.useQuery(localKey, {
    onSuccess: (user) => {
      if (user.key !== localKey) {
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
    //utils.user.get.invalidate();
  };

  console.log("user", user);
  return {
    user,
    logOut
  };
};

export default useUser;

export type UseUserReturn = ReturnType<typeof useUser>;
