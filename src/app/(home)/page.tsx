"use client";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status, data } = useSession();
  const router = useRouter();

  const handleLoginClick = async () => {
    await signIn("google", { callbackUrl: '/dashboard' })
  };


  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [router, status]);

  return (
    <main className="">
      <div className="relative mx-auto h-[calc(100vh-100px)] w-full">
        <Image
          className="h-full w-full"
          src="/hero-image.webp"
          sizes="100vw"
          width={1240}
          height={800}
          alt={"co-working"}
        />
        <div className="absolute left-0 top-0 z-10  flex h-full w-full flex-col items-center justify-center gap-6 bg-black bg-opacity-90 px-4 lg:px-0">
          <h2 className="max-w-[500px] text-center text-3xl lg:text-6xl font-bold">
            Gerencie suas Tarefas
          </h2>
          <p className=" max-w-[500px] text-center text-sm lg:text-base">
            Cansado de equilibrar várias listas de afazeres e perder prazos
            importantes? Conheça o Task Manager.
          </p>
          <Button onClick={() => handleLoginClick()} variant="default">Comece Agora</Button>
        </div>
      </div>
    </main>
  );
}
