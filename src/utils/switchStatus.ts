export function switchStatus(status: string) {
  switch (status) {
    case "Concluída":
      return "bg-green-600 bg-opacity-20 text-green-600";
    case "Pendente":
      return "bg-yellow-600 bg-opacity-20 text-yellow-600";
    default:
      return "bg-blue-600 bg-opacity-20 text-blue-600";
  }
}
