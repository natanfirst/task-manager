import Container from "@/components/ui/container";
import CreateTask from "./components/create-task";
import TableTasks from "./components/table-tasks";

const Dashboard = async () => {
  return (
    <Container className="px-[1.875rem]">
      <h1 className="text-2xl">Dashboard</h1>
      <div className="flex justify-between">
        <h2 className="mt-5 text-xl">Tasks</h2>
        <CreateTask />
      </div>

      <div className="mt-5">
        <TableTasks />
      </div>
    </Container>
  );
};

export default Dashboard;
