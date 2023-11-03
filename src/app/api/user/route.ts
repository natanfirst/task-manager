import { prismaClient } from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  const users: User[] = await prismaClient.user.findMany();

  return NextResponse.json(users);
};