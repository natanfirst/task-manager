import { LogInIcon } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

const Header = () => {
  return (
    <div className="w-full py-2">
      <Card className="">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between border-primary p-[1.875rem] py-5">
          <h1>Task Manager</h1>
          {/* <Button variant="default">
                Dashboard
            </Button> */}
          <Button
            className="flex items-center gap-3 border-primary text-sm"
            variant="outline"
          >
            <LogInIcon size={16} />
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Header;
