'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComputerFormData, ComputerSchema, SuggestIpFormData, SuggestIpSchema } from "@/lib/schema";
import type { Computer } from "@/lib/types";
import { suggestIPs, SuggestIPsInput } from "@/ai/flows/suggest-ips";
import { useState, useEffect } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComputerFormProps {
  computer?: Computer | null;
  onSubmit: (data: ComputerFormData) => Promise<{ success: boolean; message: string; errors?: any } | void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ComputerForm({ computer, onSubmit, onCancel, isSubmitting }: ComputerFormProps) {
  const form = useForm<ComputerFormData>({
    resolver: zodResolver(ComputerSchema),
    defaultValues: computer ? {
      id: computer.id,
      name: computer.name,
      ip_part_1: computer.ip_part_1,
      ip_part_2: computer.ip_part_2,
      ip_part_3: computer.ip_part_3,
    } : {
      name: "",
      ip_part_1: 0,
      ip_part_2: 0,
      ip_part_3: 0,
    },
  });

  const aiForm = useForm<SuggestIpFormData>({
    resolver: zodResolver(SuggestIpSchema),
    defaultValues: {
      description: ""
    }
  });

  const [isSuggestingIp, setIsSuggestingIp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (computer) {
      form.reset({
        id: computer.id,
        name: computer.name,
        ip_part_1: computer.ip_part_1,
        ip_part_2: computer.ip_part_2,
        ip_part_3: computer.ip_part_3,
      });
    } else {
       form.reset({
        name: "",
        ip_part_1: 0,
        ip_part_2: 0,
        ip_part_3: 0,
      });
    }
  }, [computer, form]);
  

  const handleSuggestIp = async (data: SuggestIpFormData) => {
    setIsSuggestingIp(true);
    try {
      const suggestionInput: SuggestIPsInput = { description: data.description };
      const result = await suggestIPs(suggestionInput);
      if (result) {
        form.setValue("ip_part_1", result.ip_part_1, { shouldValidate: true });
        form.setValue("ip_part_2", result.ip_part_2, { shouldValidate: true });
        form.setValue("ip_part_3", result.ip_part_3, { shouldValidate: true });
        toast({ title: "IP Suggested", description: "IP parts have been populated from AI suggestion." });
      } else {
        toast({ title: "Suggestion Failed", description: "Could not get IP suggestions.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error suggesting IP:", error);
      toast({ title: "Error", description: "An error occurred while suggesting IP parts.", variant: "destructive" });
    } finally {
      setIsSuggestingIp(false);
    }
  };

  const processSubmit = async (data: ComputerFormData) => {
    const result = await onSubmit(data);
    if (result && result.success) {
       toast({ title: computer ? "Computer Updated" : "Computer Added", description: result.message});
       onCancel(); // Close dialog on success
    } else if (result && result.message) {
       toast({ title: "Error", description: result.message, variant: "destructive" });
       if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
             form.setError(fieldName as keyof ComputerFormData, { message: errors[0] });
          }
        });
       }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Computer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Main-Server-NYC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="ip_part_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Part 1</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="255" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ip_part_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Part 2</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="255" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ip_part_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Part 3</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="255" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4 p-4 border rounded-md bg-secondary/30">
            <h3 className="text-lg font-semibold text-primary">AI IP Suggester</h3>
            <FormField
              control={aiForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Computer Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the computer, e.g., 'Main accounting printer in the London office, 3rd floor'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={aiForm.handleSubmit(handleSuggestIp)} disabled={isSuggestingIp || !aiForm.formState.isValid} variant="outline">
              {isSuggestingIp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Suggest IP Parts
            </Button>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {computer ? "Update Computer" : "Add Computer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
