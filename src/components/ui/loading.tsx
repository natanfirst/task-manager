import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center fixed top-0 left-0 right-0 bottom-0">
      <Loader2 size={24} className="animate-spin text-primary" />
    </div>
  );
};

export default Loading;
