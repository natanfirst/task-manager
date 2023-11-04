"use client";

import { supabase } from "@/lib/supabase";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
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
    const roomOne = supabase.channel("room_01");
    roomOne
      .on("presence", { event: "sync" }, () => {
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomOne);
    };
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = useMemo(() => ({ user }),[user])

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
