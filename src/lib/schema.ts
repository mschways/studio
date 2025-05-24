import { z } from 'zod';

export const ComputerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(15, "Name must be 15 characters or less"),
  ip_part_1: z.coerce.number().min(0, "IP part must be between 0 and 255").max(255, "IP part must be between 0 and 255"),
  ip_part_2: z.coerce.number().min(0, "IP part must be between 0 and 255").max(255, "IP part must be between 0 and 255"),
  ip_part_3: z.coerce.number().min(0, "IP part must be between 0 and 255").max(255, "IP part must be between 0 and 255"),
});

export type ComputerFormData = z.infer<typeof ComputerSchema>;

export const SuggestIpSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters long")
});

export type SuggestIpFormData = z.infer<typeof SuggestIpSchema>;
