"use client";
import { supabase } from "@/lib/supabase";
import { Task } from "@prisma/client";
import { User } from "next-auth";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

interface ITaskContext {
  assignee: User | null;
  createTask: (userId: string, assigneeId?: string) => Promise<void>;
  setAssignee: React.Dispatch<React.SetStateAction<User | null>>;
  body: CreateBody;
  getTasks: () => Promise<void>;
  setBody: React.Dispatch<React.SetStateAction<CreateBody>>;
  tasks: TaskResponse[];
  deleteTask: (taskId: number) => Promise<void>;
  updateTaskStatus: (id: number, status: string) => Promise<void>;
  listLoad: boolean
}

export const TaskContext = createContext<ITaskContext>({
  createTask: async () => {},
  assignee: null,
  setAssignee: () => {},
  body: {
    description: "",
    priority: "",
    assignee: "",
  },
  setBody: () => {},
  getTasks: async () => {},
  tasks: [],
  deleteTask: async () => {},
  updateTaskStatus: async () => {},
  listLoad: false
});

const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [assignee, setAssignee] = useState<User | null>(null);
  const [listLoad, setListLoad] = useState(false);
  const [body, setBody] = useState<CreateBody>({
    description: "",
    priority: "Alta",
    assignee: "",
  });

  const createTask = useCallback(
    async (userId: string, assigneeId?: string) => {
      try {
        const response = await fetch("/api/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: body.description,
            priority: body.priority,
            assignee: assigneeId || null,
            createdById: userId,
          }),
        });

        if (response.ok) {
          setBody({
            description: "",
            priority: "Alta",
            assignee: "",
          });
          setAssignee(null);
        } else {
          const errorMessage = await response.text();

          console.error(errorMessage);
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error(error);
        toast.error("Ocorreu um erro ao processar a solicitação.");
      }
    },
    [body.description, body.priority],
  );

  const updateTaskValue = useCallback(async (taskId: number) => {
    try {
      const response = await fetch(`/api/task/${taskId}`);
      const data = await response.json();
      setTasks((prev) => {
        const state = [...prev];
        const taskExists = state.find((item) => item.id === taskId);
        state?.forEach((item) => {
          if (item.id === taskId) {
            item = data;
          }
        });
        if (!taskExists) {
          return [...state, data];
        }
        return state;
      });
    } catch (error) {}
  }, []);

  const getTasks = useCallback(async () => {
    setListLoad(true);
    try {
      const response = await fetch("/api/task");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
    } finally {
      setListLoad(false);
    }
  }, []);

  const deleteTask = useCallback(
    async (taskId: number) => {
      try {
        await fetch(`/api/task/${taskId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTasks([...tasks.filter((item) => item.id !== taskId)]);
      } catch (error) {}
    },
    [tasks],
  );

  const updateTaskStatus = useCallback(async (id: number, status: string) => {
    try {
      await fetch(`/api/task/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Task",
        },
        (payload) => {
          getTasks();
          if (payload.eventType === "DELETE") {
            toast.success("Tarefa Excluída");
          }
          if (payload.eventType === "UPDATE") {
            toast.success("Tarefa Atualizada");
          }
          if (payload.eventType === "INSERT") {
            toast.success("Nova tarefa adicionada !");
          }
          //  if( payload.eventType === 'DELETE') {
          //   setTasks([...tasks.filter((item) => item.id !== payload.old.id)]);
          //   console.log(payload);
          //  }
          //  if( payload.eventType === 'UPDATE') {
          //   updateTaskValue(payload.new.id)
          //  }
          //  if( payload.eventType === 'INSERT') {
          //   updateTaskValue(payload.new.id)
          //   toast.success('Nova tarefa adicionada !')
          //  }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, tasks, setTasks, updateTaskValue, getTasks]);

  const value = useMemo(
    () => ({
      createTask,
      assignee,
      setAssignee,
      body,
      setBody,
      getTasks,
      tasks,
      deleteTask,
      updateTaskStatus,
      listLoad
    }),
    [assignee, body, createTask, getTasks, tasks, deleteTask, updateTaskStatus, listLoad],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskProvider;

//types

interface CreateBody {
  description: string;
  priority: string;
  assignee: string;
}

export interface TaskResponse extends Task {
  createdBy: User;
  assignedTo: User;
}
