import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { email: string } },
) => {
  const email = params.email;
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  return NextResponse.json(user);
};
