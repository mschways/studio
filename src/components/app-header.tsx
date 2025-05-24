
'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface AppHeaderProps {
  onAddComputer: () => void;
}

export function AppHeader({ onAddComputer }: AppHeaderProps) {
  const { setTheme } = useTheme();

  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/50 shadow-sm bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          IP Explorer
        </h1>
        <div className="flex items-center space-x-4">
          <Button onClick={onAddComputer}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Computer
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
