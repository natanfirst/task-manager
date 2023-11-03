import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { description, priority, assignee, createdById } = await req.json();

    if (!description) {
      return NextResponse.json("Descrição é obrigatória.", { status: 400 });
    }

    const response = await prismaClient.task.create({
      data: {
        description: description,
        priority: priority,
        assignee: assignee || null,
        createdById: createdById,
        assignedToId: assignee || null,
        status: "Pendente"
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar a solicitação." },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  const response = await prismaClient.task.findMany({
    include: {
      createdBy: true,
      assignedTo: true,
    }
  });

  return NextResponse.json(response);
};
