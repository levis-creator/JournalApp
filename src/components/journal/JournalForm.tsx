"use client";
import { editJournal, journalAtom, journalFormOpen, refreshJournalsAtom } from "@/atoms/JournalEntryAtoms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ENDPOINTS } from "@/lib/ApiUrl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import { Button } from "../ui/button";
import CategorySelect from "./CategorySelect";

// Zod validation schema
const journalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
  categories: z.array(z.number()).min(1, "Select at least one category"),
  entryDate: z.date().default(new Date()),
});

type JournalFormValues = z.infer<typeof journalSchema>;

export function JournalEntryForm() {
  const [isOpen, setIsOpen] = useAtom(journalFormOpen);
  const [, refreshJournals] = useAtom(refreshJournalsAtom);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [journal] = useAtom(journalAtom);
  const editItem = useAtomValue(editJournal);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      categories: [],
      entryDate: new Date(),
    },
  });

  // Initialize form with journal data
  useEffect(() => {
    if (editItem && journal) {
      const defaultValues = {
        title: journal.title,
        content: journal.content,
        categories: journal.categories.map(c => c.category.id),
        entryDate: new Date(journal.entryDate),
      };
      
      reset(defaultValues);
      setSelectedCategoryIds(defaultValues.categories);
    }
  }, [journal, editItem, reset]);

  // Sync selected categories with form state
  useEffect(() => {
    setValue("categories", selectedCategoryIds);
  }, [selectedCategoryIds, setValue]);

  const handleSave = async (data: JournalFormValues) => {
    const url = `${ENDPOINTS.JOURNALS}/${editItem && journal?.id}`;
    const method = editItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save journal entry");

      await refreshJournals();
      closeModal();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("Failed to save journal entry. Please try again.");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    reset({
      title: "",
      content: "",
      categories: [],
      entryDate: new Date(),
    });
    setSelectedCategoryIds([]);
  };

  const handleAddNewCategory = (category: { id: number }) => {
    setSelectedCategoryIds(prev => [...prev, category.id]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit' : 'New'} Journal Entry</DialogTitle>
          <DialogDescription>
            {editItem ? 'Update your journal entry' : 'Fill out the form to create a new journal entry'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                {...register("title")}
                error={!!errors.title}
                hint={errors.title?.message}
              />
            </div>

            <div>
              <Label>Categories</Label>
              <CategorySelect
                selected={selectedCategoryIds}
                onChange={setSelectedCategoryIds}
                onAddNewCategory={handleAddNewCategory}
              />
              {errors.categories && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.categories.message}
                </p>
              )}
            </div>

            <div>
              <Label>Content</Label>
              <div className="rounded-lg border">
                <TextArea
                  {...register("content")}
                  placeholder="Write your journal entry..."
                  className="w-full min-h-[300px] p-4 resize-none outline-none"
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Entry Date</Label>
              <Input
                type="date"
                {...register("entryDate", { 
                  valueAsDate: true,
                  setValueAs: (v) => v ? new Date(v) : new Date()
                })}
                defaultValue={journal?.entryDate ? new Date(journal.entryDate).toISOString().split('T')[0] : ''}
                error={!!errors.entryDate}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button type="submit">Save Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}