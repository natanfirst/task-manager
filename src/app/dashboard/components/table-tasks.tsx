"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TaskContext, TaskResponse } from "@/providers/task";
import { UserContext } from "@/providers/user";
import { getInitials } from "@/utils/getInitials";
import { switchPriority } from "@/utils/switchPriority";
import { switchStatus } from "@/utils/switchStatus";
import { ListChecks, TrashIcon } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import EditTask from "./edit-task";

export default function TableTasks() {
  const { user } = useContext(UserContext);
  const { status } = useSession();
  const router = useRouter();
  const {
    tasks,
    getTasks,
    deleteTask,
    updateTaskStatus,
    listLoad,
    setCurrentTask,
  } = useContext(TaskContext);
  const [selectedPriority, setSelectedPriority] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todas");

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [router, status]);

  const filterByPriority = (task: TaskResponse) => {
    if (selectedPriority === "Todas" || task.priority === selectedPriority) {
      return true;
    }
    return false;
  };

  const filterByStatus = (task: TaskResponse) => {
    if (selectedStatus === "Todas" || task.status === selectedStatus) {
      return true;
    }
    return false;
  };

  const priorityOrder: { [key: string]: number } = {
    Alta: 1,
    Média: 2,
    Baixa: 3,
  };

  const sortedTasks = tasks?.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const filteredTasks = sortedTasks
    ?.filter(filterByPriority)
    .filter(filterByStatus);

  return (
    <div>
      <div className="flex gap-3">
        <Select onValueChange={(value) => setSelectedStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas</SelectItem>
            <SelectItem value="Concluída">Concluídas</SelectItem>
            <SelectItem value="Pendente">Pendentes</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(val) => setSelectedPriority(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Média">Média</SelectItem>
            <SelectItem value="Baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="mt-5">
        {listLoad ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 10 }).map((_, key) => (
              <Skeleton key={key} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criador</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks?.map((task, key) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">
                    <p className="min-w-[120px]"> {task.description}</p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-xl border px-2 py-[2px]",
                        switchPriority(task.priority),
                      )}
                    >
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={task.status === "Concluída"}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={cn(
                            "rounded-xl border px-2 py-[2px]",
                            switchStatus(task.status ?? ""),
                          )}
                        >
                          {task.status || "Alterar Status"}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Button
                            onClick={() =>
                              updateTaskStatus(task.id, "Concluída")
                            }
                            className="flex items-center gap-3 text-sm"
                            variant="outline"
                          >
                            <span
                              className={cn(
                                "rounded-xl border px-2 py-[2px]",
                                switchStatus("Concluída"),
                              )}
                            >
                              Concluída
                            </span>
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Avatar>
                      {task.createdBy?.image && (
                        <AvatarImage src={task.createdBy?.image} />
                      )}
                      <AvatarFallback>
                        {getInitials(task.createdBy.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="">
                    <div className="flex items-center gap-3 capitalize">
                      {task.assignedTo ? (
                        <>
                          <Avatar>
                            {task.assignedTo?.image && (
                              <AvatarImage src={task.assignedTo?.image} />
                            )}
                            <AvatarFallback>
                              {getInitials(task?.assignedTo?.name || "User")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden lg:block">
                            {task.assignedTo?.name}
                          </span>
                        </>
                      ) : (
                        "Sem responsável"
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <span>{moment(task.createdAt).format("DD/MM/YYYY")}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex items-center justify-end">
                        {(task?.createdBy?.id === user?.id ||
                          task?.assignedTo?.id === user?.id) && (
                          <EditTask
                            handleOpen={() => {
                              setCurrentTask(task);
                            }}
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-end">
                        {(task?.createdBy?.id === user?.id ||
                          task?.assignedTo?.id === user?.id) &&
                          task.status !== "Concluída" && (
                            <button onClick={() => deleteTask(task.id)}>
                              <TrashIcon size={16} color="red" />
                            </button>
                          )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-5 flex flex-col items-center">
            <ListChecks color="white" size={32}/>
            <p className="text-center"> Sem tarefas encontradas</p>
          </div>
        )}
      </Card>
    </div>
  );
}
