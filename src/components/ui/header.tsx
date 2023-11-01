"use client";

import { LogInIcon, LogOutIcon } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
const Header = () => {
  const { status, data } = useSession();

  const handleLoginClick = async () => {
    await signIn(undefined, { callbackUrl: '/dashboard' })
  };

  const handleLogoutClick = async () => {
    await signOut({ callbackUrl: '/' })
  };

  return (
    <div className="w-full py-2">
      <Card className="">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between border-primary p-[1.875rem] py-5">
          <h1>Task Manager</h1>
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3">
                <Avatar>
                  {data.user?.image && <AvatarImage src={data.user?.image} />}
                  <AvatarFallback>{data.user?.name}</AvatarFallback>
                </Avatar>
                <span className="capitalize">{data.user?.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Button
                  onClick={() => handleLogoutClick()}
                  className="flex items-center gap-3 border-primary text-sm"
                  variant="outline"
                >
                  <LogOutIcon size={16} />
                  Logout
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => handleLoginClick()}
              className="flex items-center gap-3 border-primary text-sm"
              variant="outline"
            >
              <LogInIcon size={16} />
              Login
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Header;
