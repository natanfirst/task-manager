"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

interface IUserContext {
  user: User | null;
}

export const UserContext = createContext<IUserContext>({
  user: null,
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data } = useSession();

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/${data?.user?.email}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
    }
  }, [data]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
