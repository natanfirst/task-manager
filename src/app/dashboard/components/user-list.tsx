"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const UserList = ({ setCurrent }: { setCurrent: (user: User) => void }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/user");
      const usersData: User[] = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex gap-3 border-primary" variant="outline">
          Adicionar <PlusIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 px-2">
        {users?.map((user, key) => (
          <div
            onClick={() => setCurrent(user)}
            className="flex cursor-pointer items-center gap-3 px-5 py-2 hover:bg-accent"
            key={key}
          >
            <Avatar>
              {user?.image && <AvatarImage src={user?.image} />}
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
        ))}
        <div></div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserList;
