export function switchPriority(priority: string) {
    switch (priority) {
      case "Alta":
        return "bg-red-600 bg-opacity-20 text-red-600";
      case "Média":
        return "bg-yellow-600 bg-opacity-20 text-yellow-600";
      case "Baixa":
        return "bg-green-600 bg-opacity-20 text-green-600";
      default:
        return "";
    }
  }
  