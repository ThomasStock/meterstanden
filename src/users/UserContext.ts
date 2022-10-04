import React from "react";
import type { UseUserReturn } from "./useUser";

const UserContext = React.createContext<UseUserReturn>({
  user: undefined,
  logOut: () => null
});

export default UserContext;
