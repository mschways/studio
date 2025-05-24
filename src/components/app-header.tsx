'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AppHeaderProps {
  onAddComputer: () => void;
}

export function AppHeader({ onAddComputer }: AppHeaderProps) {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/50 shadow-sm bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          IP Explorer
        </h1>
        <Button onClick={onAddComputer}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Computer
        </Button>
      </div>
    </header>
  );
}
