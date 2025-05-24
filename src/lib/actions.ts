
'use server';

import { revalidatePath } from 'next/cache';
import type { Computer, ComputerEntry } from './types';
import { ComputerFormData, ComputerSchema } from './schema';

// Mock database
let computers: Computer[] = [
  { id: '1', name: 'Server-Alpha', ip_part_1: 192, ip_part_2: 168, ip_part_3: 1 },
  { id: '2', name: 'Printer-Sales', ip_part_1: 10, ip_part_2: 0, ip_part_3: 50 },
  { id: '3', name: 'Dev-Machine', ip_part_1: 172, ip_part_2: 16, ip_part_3: 31 },
];

const ITEMS_PER_PAGE = 5;

export async function getComputers(currentPage: number = 1): Promise<{ computers: Computer[], totalPages: number, totalCount: number }> {
  const totalCount = computers.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComputers = computers.slice(offset, offset + ITEMS_PER_PAGE);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { computers: paginatedComputers, totalPages, totalCount };
}

export async function addComputer(formData: ComputerFormData): Promise<{ success: boolean; message: string; errors?: any }> {
  const validationResult = ComputerSchema.safeParse(formData);
  if (!validationResult.success) {
    return { success: false, message: 'Validation failed.', errors: validationResult.error.flatten().fieldErrors };
  }

  // Destructure to explicitly separate any potential 'id' from the form (which should be undefined for 'add')
  // and the actual data for the new computer.
  const { id: formId, ...computerData } = validationResult.data;

  const newComputer: Computer = {
    id: crypto.randomUUID(), // Always generate a new ID for new computers
    name: computerData.name,
    ip_part_1: computerData.ip_part_1,
    ip_part_2: computerData.ip_part_2,
    ip_part_3: computerData.ip_part_3,
  };
  
  computers.unshift(newComputer); // Add to the beginning of the array
  revalidatePath('/');
  return { success: true, message: 'Computer added successfully.' };
}

export async function updateComputer(formData: ComputerFormData): Promise<{ success: boolean; message: string; errors?: any }> {
  const validationResult = ComputerSchema.safeParse(formData);
  if (!validationResult.success || !validationResult.data.id) {
    return { success: false, message: 'Validation failed or ID missing.', errors: validationResult.error?.flatten().fieldErrors };
  }
  
  const { id, ...dataToUpdate } = validationResult.data;
  const index = computers.findIndex(c => c.id === id);
  if (index === -1) {
    return { success: false, message: 'Computer not found.' };
  }
  computers[index] = { ...computers[index], ...dataToUpdate };
  revalidatePath('/');
  return { success: true, message: 'Computer updated successfully.' };
}

export async function deleteComputer(id: string): Promise<{ success: boolean; message: string }> {
  const initialLength = computers.length;
  computers = computers.filter(c => c.id !== id);
  if (computers.length === initialLength) {
    return { success: false, message: 'Computer not found.' };
  }
  revalidatePath('/');
  return { success: true, message: 'Computer deleted successfully.' };
}

export async function getComputerById(id: string): Promise<Computer | null> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  const computer = computers.find(c => c.id === id);
  return computer || null;
}
