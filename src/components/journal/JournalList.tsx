"use client";
import { editJournal, journalAtom, journalFormOpen, journalsAtom, refreshJournalsAtom } from '@/atoms/JournalEntryAtoms';
import { ENDPOINTS } from '@/lib/ApiUrl';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import JournalCard from './JournalCard';




interface JournalListProps {
    filters?: {
        category?: string;
        tag?: string;
        search?: string;
    };
}

const JournalList = ({ filters }: JournalListProps) => {
    const { data, error } = useAtomValue(journalsAtom)
    const [, refreshJournals] = useAtom(refreshJournalsAtom);
    const setFormOpen = useSetAtom(journalFormOpen)
    const setJournal = useSetAtom(journalAtom)
    const setEdit=useSetAtom(editJournal)

    // Fetch journals when the component mounts
    useEffect(() => {
        refreshJournals();
    }, [refreshJournals]);
    // Handle loading and error states
    if (error) return <div>Failed to load entries</div>;
    if (!data) return <div>Loading...</div>;

    async function onDelete(id: number) {
        const res = await fetch(`${ENDPOINTS.JOURNALS}/${id}`, {
            method: 'DELETE'
        })

        if (res.status !== 204) {

            toast.error("Delete unsuccessful!")
        } else {

            toast.success("Deleted successfully!")
            await refreshJournals()
        }
    }
    async function onEdit(id: number) {
        const res = await fetch(`${ENDPOINTS.JOURNALS}/${id}`)
        const results = await res.json()
        console.log(results)
        setJournal(results)
        setEdit(true)
        setFormOpen(true)
    }

    return (
        <div className="space-y-4">
            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No journal entries found{!!filters && " matching your criteria"}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map(entry => (
                        <JournalCard
                            key={entry.id}
                            entry={entry}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export { JournalCard, JournalList };

