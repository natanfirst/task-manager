import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

   const response = await prismaClient.task.delete({
    where: {
      id: parseInt(id),
    },
  });

  console.log(response)

  return NextResponse.json({message: 'Tarefa Excluída !'}, {status: 200});
};

export const GET = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  const response = await prismaClient.task.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      createdBy: true,
      assignedTo: true,
    },
  });

  return NextResponse.json(response);
};

export const PATCH = async (req: Request, {params}: {params: {id: string}}) => {
  const {status} = await req.json()
  const response = await prismaClient.task.update({
    where: {
      id: parseInt(params.id) 
    },
    data: {
      status: status
    }
  });

  return NextResponse.json(response, {
    status: 200
  });
};

