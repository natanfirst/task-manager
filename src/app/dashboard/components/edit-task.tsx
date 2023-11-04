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
import { EditIcon, TrashIcon } from "lucide-react";
import { TaskContext } from "@/providers/task";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface EditTaskProps {
  handleOpen: () => void;
}

const EditTask = ({ handleOpen }: EditTaskProps) => {
  const { currentTask, setCurrentTask, updateTask } =
    useContext(TaskContext);
  const [open, setOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const priorities = ["Alta", "Média", "Baixa"];
  const status = ["Concluída", "Pendente"];

  const onSubmit = useCallback(() => {
    if (!currentTask?.description) {
      setHasError(true);
      toast.error("Por favor adicionar descrição !");
      return;
    }
    setHasError(false);

    const { description, assignee, status, priority } = currentTask;

    if (currentTask?.id) {
      updateTask(currentTask?.id, { description, assignee, status, priority });
      setOpen(false);
    }
  }, [currentTask, updateTask]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger onClick={() => handleOpen()}>
        <EditIcon size={18} color="blue" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
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
              value={currentTask?.description}
              onChange={(ev) => {
                setCurrentTask((prev) =>
                  prev === null
                    ? null
                    : { ...prev, description: ev.target.value },
                );
              }}
              id="description"
              className={cn(
                "col-span-3 border-muted-foreground",
                hasError && !currentTask?.description && "border-red-600",
              )}
            />
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <Label htmlFor="description" className="text-right">
              Prioridade
            </Label>
            <Select
              value={currentTask?.priority}
              onValueChange={(val) => {
                setCurrentTask((prev) =>
                  prev === null ? null : { ...prev, priority: val },
                );
              }}
            >
              <SelectTrigger
                value={currentTask?.priority}
                className="w-full border-muted-foreground"
              >
                <SelectValue
                  placeholder={currentTask?.priority}
                  defaultValue={currentTask?.priority}
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
          <div className="flex w-full flex-col items-start gap-2">
            <Label htmlFor="description" className="text-right">
              Status
            </Label>
            <Select
              value={currentTask?.status}
              onValueChange={(val) => {
                setCurrentTask((prev) =>
                  prev === null ? null : { ...prev, status: val },
                );
              }}
            >
              <SelectTrigger
                value={currentTask?.status}
                className="w-full border-muted-foreground"
              >
                <SelectValue
                  placeholder={currentTask?.status}
                  defaultValue={currentTask?.status}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Prioridade</SelectLabel>
                  {status.map((item, key) => (
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
            {currentTask?.assignedTo ? (
              <div className="relative mt-3 w-fit">
                <button
                  onClick={() => {
                    setCurrentTask((prev) =>
                      prev === null
                        ? null
                        : {
                            ...prev,
                            assignedTo: null,
                            assignee: null,
                            assignedToId: null,
                          },
                    );
                  }}
                  className="absolute -right-2 -top-1 z-10 rounded-full bg-red-600 p-1"
                >
                  <TrashIcon color="white" size={14} />
                </button>
                <Avatar>
                  {currentTask?.assignedTo?.image && (
                    <AvatarImage src={currentTask?.assignedTo?.image} />
                  )}
                  <AvatarFallback>
                    {currentTask?.assignedTo?.name}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <UserList
                setCurrent={(user) =>
                  setCurrentTask((prev) =>
                    prev === null
                      ? null
                      : {
                          ...prev,
                          assignedTo: user,
                          assignedToId: user.id,
                          assignee: user.id,
                        },
                  )
                }
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSubmit()} type="button">
            Editar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
