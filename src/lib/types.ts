export interface Computer {
  id: string;
  name: string;
  ip_part_1: number;
  ip_part_2: number;
  ip_part_3: number;
}

export type ComputerEntry = Omit<Computer, 'id'>;
