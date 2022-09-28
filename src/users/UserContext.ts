import React from "react";
import type { UseUserReturn } from "./useUser";

const UserContext = React.createContext<UseUserReturn>({
  key: undefined,
  logOut: () => null
});

export default UserContext;
