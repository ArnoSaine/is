import { PropsWithChildren, createContext, useContext, useState } from "react";

type Role = "admin";

interface User {
  name: string;
  roles?: Role[];
}

const UserContext = createContext<
  null | [User | null, React.Dispatch<React.SetStateAction<User | null>>]
>(null);

export default UserContext;

export function UserProvider({ children }: PropsWithChildren) {
  const userState = useState<User | null>(null);

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
