import { ModeToggle } from "@/components/ui/mode-toggle";
import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div id="header" className="flex">
      <div className="w-min text-right">
        <h1 className="text-3xl font-extrabold leading-relaxed tracking-wide">
          STAGECOACH <br /> PROBLEM
        </h1>
      </div>
      <div className="flex flex-1" />
      <div className="flex gap-5 justify-center items-center">
        <a href="https://github.com/santiago-cujaban/Stagecoach_Dynamic_Programming">
          <Button variant="outline" size="icon">
            <GithubIcon className="h-4 w-4" />
          </Button>
        </a>
        <ModeToggle />
      </div>
    </div>
  );
}
