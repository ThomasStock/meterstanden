import { useEffect } from "react";
import { trpc } from "~/utils/trpc";
import useLocalKey from "./useLocalKey";

const useUser = () => {
  const { localKey, updateLocalKey } = useLocalKey();

  const utils = trpc.useContext();

  const { data: user, remove } = trpc.user.get.useQuery(
    { id: localKey! },
    { enabled: !!localKey }
  );

  const createUser = trpc.user.create.useMutation({
    onSuccess: (user) => {
      console.log("setting data", user);
      utils.user.get.setData(user, { id: user.key });
      updateLocalKey(user.key);
    }
  });

  useEffect(() => {
    if (!localKey) {
      createUser.mutate();
    }
  }, [localKey]);

  const logOut = () => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("logging out");
    updateLocalKey(null);
    remove();
  };

  return {
    user,
    logOut
  };
};

export default useUser;

export type UseUserReturn = ReturnType<typeof useUser>;
