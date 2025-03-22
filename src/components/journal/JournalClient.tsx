'use client';
import { journalFormOpen } from '@/atoms/JournalEntryAtoms';
import { useSetAtom } from 'jotai';
import { Plus } from 'lucide-react';
import Button from '../ui/button/Button';
import { JournalEntryForm } from './JournalForm';
import { JournalList } from './JournalList';


export function JournalClient() {
  const setIsOpen = useSetAtom(journalFormOpen);
  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <JournalEntryForm />
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-4">
        <div className="flex">
          <Button onClick={openModal}>
            <Plus />
            Add journal
          </Button>
        </div>
      </div>
      <JournalList
      />
    </>
  );
}