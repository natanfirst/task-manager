import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Your Task Manager",
};

export default function Home() {
  return (
    <main className="">
       <div className="relative mx-auto h-[calc(100vh-100px)] w-full">
      <Image
        className="h-full w-full"
        src="/hero-image.jpg"
        sizes="100vw"
        width={1240}
        height={800}
        alt={"co-working"}
      />
      <div className="absolute left-0 top-0 z-10  flex h-full w-full flex-col items-center justify-center gap-6 bg-black bg-opacity-90">
        <h2 className="max-w-[500px] text-center text-6xl font-bold">
          Gerencie suas Tarefas
        </h2>
        <p className=" max-w-[500px] text-center">
          Cansado de equilibrar várias listas de afazeres e perder prazos
          importantes? Conheça o Task Manager.
        </p>
        <Button variant="default">Comece Agora</Button>
      </div>
    </div>
    </main>
  );
}
