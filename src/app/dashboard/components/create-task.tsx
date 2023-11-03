"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { prismaClient } from "@/lib/prisma";
import { useContext, useState, useCallback } from "react";
import UserList from "./user-list";
import { UserContext } from "@/providers/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrashIcon } from "lucide-react";
import { TaskContext } from "@/providers/task";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const CreateTask = () => {
  const { createTask, body, setBody, assignee, setAssignee } =
    useContext(TaskContext);
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [hasError, setHasError] = useState(false)

  const priorities = ["Alta", "Média", "Baixa"];

  const onSubmit = useCallback(() => {
    if(!body.description) {
      setHasError(true)
      toast.error("Por favor adicionar descrição !")
      return
    }
    setHasError(false)
    if (user?.id) {
      createTask(user?.id, assignee?.id)
      setOpen(false)
    };
  },[assignee?.id, body.description, createTask, user?.id])

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <Button>Criar Tarefa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Tarefa</DialogTitle>
          <DialogDescription>
            Adicione a descrição e sua prioridade
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input
              onChange={(ev) => {
                setBody((prev) => ({ ...prev, description: ev.target.value }));
              }}
              id="description"
              className={cn("col-span-3 border-muted-foreground", hasError && !body.description && "border-red-600")}
            />
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <Label htmlFor="description" className="text-right">
              Prioridade
            </Label>
            <Select
              value={body.priority}
              onValueChange={(val) => {
                setBody((prev) => ({ ...prev, priority: val }));
              }}
            >
              <SelectTrigger
                value={body.priority}
                className="w-full border-muted-foreground"
              >
                <SelectValue
                  placeholder={body.priority}
                  defaultValue={body.priority}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Prioridade</SelectLabel>
                  {priorities.map((item, key) => (
                    <SelectItem key={key} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="username" className="text-right">
              Responsável
            </Label>
            {assignee ? (
              <div className="relative mt-3 w-fit">
                <button
                  onClick={() => setAssignee(null)}
                  className="absolute -right-2 -top-1 z-10 rounded-full bg-red-600 p-1"
                >
                  <TrashIcon color="white" size={14} />
                </button>
                <Avatar>
                  {assignee?.image && <AvatarImage src={assignee?.image} />}
                  <AvatarFallback>{user?.name}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <UserList setCurrent={(user) => setAssignee(user)} />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onSubmit()}
            type="button"
          >
            Criar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
