
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ComputerDialog } from "./computer-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import type { Computer } from "@/lib/types";
import { deleteComputer } from "@/lib/actions";
import { Edit, Trash2, Router, PlusCircle } from "lucide-react"; // Router icon for IP address, PlusCircle for empty state
import { AppHeader } from './app-header';
import { PaginationControls } from './pagination-controls';

interface ComputerTableClientProps {
  initialComputers: Computer[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

const ITEMS_PER_PAGE = 5; // Should match actions.ts

export function ComputerTableClient({ initialComputers, totalPages, totalCount, currentPage }: ComputerTableClientProps) {
  const [computers, setComputers] = useState<Computer[]>(initialComputers);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);

  const handleAddComputer = () => {
    setSelectedComputer(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditComputer = (computer: Computer) => {
    setSelectedComputer(computer);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteComputer = (computer: Computer) => {
    setSelectedComputer(computer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedComputer) return { success: false, message: "No computer selected" };

    const originalComputers = [...computers]; // Store current state for potential rollback
    
    // Optimistically update UI
    setComputers(prevComputers => prevComputers.filter(c => c.id !== selectedComputer.id));

    const result = await deleteComputer(selectedComputer.id);

    if (!result.success) {
      // Rollback optimistic update on failure
      setComputers(originalComputers);
      // The DeleteConfirmDialog will show the error toast based on result.message
    }
    // If successful, the optimistic update remains, and revalidatePath will eventually refresh data from server.
    // The DeleteConfirmDialog will show the success toast.
    return result;
  };
  
  // Update computers if initialComputers prop changes (e.g., due to navigation or revalidation)
  useEffect(() => {
    setComputers(initialComputers);
  }, [initialComputers]);


  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onAddComputer={handleAddComputer} />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-8">
        {totalCount > 0 ? (
          <>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Router className="inline-block mr-2 h-5 w-5 text-primary" /> IP Address
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {computers.map((computer) => (
                    <TableRow key={computer.id}>
                      <TableCell className="font-medium tabular-nums">
                        {computer.ip_part_1}.{computer.ip_part_2}.{computer.ip_part_3}
                      </TableCell>
                      <TableCell>{computer.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditComputer(computer)} className="mr-2 hover:text-accent-foreground">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteComputer(computer)} className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <PaginationControls 
              currentPage={currentPage} 
              totalPages={totalPages} 
              totalCount={totalCount}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Router size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Computers Found</h2>
            <p className="text-muted-foreground mb-6">Get started by adding a new computer.</p>
            <Button onClick={handleAddComputer}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Your First Computer
            </Button>
          </div>
        )}
      </main>

      <ComputerDialog
        isOpen={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        computer={selectedComputer}
      />

      {selectedComputer && (
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
          computerName={selectedComputer.name}
        />
      )}
       <footer className="text-center py-4 border-t text-sm text-muted-foreground">
          © {new Date().getFullYear()} IP Explorer. All rights reserved.
        </footer>
    </div>
  );
}

