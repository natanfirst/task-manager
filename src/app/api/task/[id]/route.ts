import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "ID da tarefa não fornecido." }, { status: 400 });
  }

  const taskToDelete = await prismaClient.task.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!taskToDelete) {
    return NextResponse.json({ message: "Tarefa não encontrada." }, { status: 404 });
  }

  await prismaClient.task.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ message: "Tarefa Excluída !" }, { status: 200 });
};

export const GET = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "ID da tarefa não fornecido." }, { status: 400 });
  }

  const response = await prismaClient.task.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      createdBy: true,
      assignedTo: true,
    },
  });

  if (!response) {
    return NextResponse.json({ message: "Tarefa não encontrada." }, { status: 404 });
  }

  return NextResponse.json(response);
};

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "ID da tarefa não fornecido." }, { status: 400 });
  }

  const { description, status, priority, assignee } = await req.json();

  const data: {
    description: string;
    status: string;
    priority: string;
    assignedToId?: string | null;
    assignee?: string | null;
  } = {
    description: description,
    status: status,
    priority: priority,
  };

  if (assignee !== undefined) {
    data.assignedToId = assignee;
    data.assignee = assignee;
  }

  const taskToUpdate = await prismaClient.task.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!taskToUpdate) {
    return NextResponse.json({ message: "Tarefa não encontrada." }, { status: 404 });
  }

  const response = await prismaClient.task.update({
    where: {
      id: parseInt(id),
    },
    data: data,
  });

  return NextResponse.json(response, {
    status: 200,
  });
};