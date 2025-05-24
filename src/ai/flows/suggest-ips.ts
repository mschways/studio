// This file is machine-generated - edit at your own risk.
'use server';
/**
 * @fileOverview AI flow to suggest IP address parts based on a description.
 *
 * - suggestIPs - A function that suggests IP address parts.
 * - SuggestIPsInput - The input type for the suggestIPs function.
 * - SuggestIPsOutput - The return type for the suggestIPs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIPsInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A description of the computer, including details like location and function.'
    ),
});
export type SuggestIPsInput = z.infer<typeof SuggestIPsInputSchema>;

const SuggestIPsOutputSchema = z.object({
  ip_part_1: z.number().describe('The first part of the IP address.'),
  ip_part_2: z.number().describe('The second part of the IP address.'),
  ip_part_3: z.number().describe('The third part of the IP address.'),
});
export type SuggestIPsOutput = z.infer<typeof SuggestIPsOutputSchema>;

export async function suggestIPs(input: SuggestIPsInput): Promise<SuggestIPsOutput> {
  return suggestIPsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIPsPrompt',
  input: {schema: SuggestIPsInputSchema},
  output: {schema: SuggestIPsOutputSchema},
  prompt: `You are an expert network administrator. Given the following description of a computer, suggest three IP address parts (ip_part_1, ip_part_2, and ip_part_3) that would be appropriate for it.

Description: {{{description}}}

Return the IP address parts as a JSON object.
`, // Fixed: Added explicit instruction to return a JSON object
});

const suggestIPsFlow = ai.defineFlow(
  {
    name: 'suggestIPsFlow',
    inputSchema: SuggestIPsInputSchema,
    outputSchema: SuggestIPsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
