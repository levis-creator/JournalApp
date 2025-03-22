import { ENDPOINTS } from "@/lib/ApiUrl";
import { JournalEntry, Tag } from "@prisma/client";
import { atom } from "jotai";
import { userAtom } from "./UserAtoms";

 interface DataType<T>{
    data: T[], // Stores the list of journals
    isLoading: boolean, // Loading state
    error: null, 
 }
export const journalsAtom = atom<DataType<JournalEntry>>({
    data: [], // Stores the list of journals
    isLoading: false, // Loading state
    error: null, // Error state
  });
export const journalAtom=atom<JournalEntry|null>(null)
export const journalFormOpen= atom(false)
export const journalOpen= atom(false)
export const editJournal= atom(false)

export const tagsAtom=atom<DataType<Tag>>({
    data: [], // Stores the list of journals
    isLoading: false, // Loading state
    error: null, // Error state
  })

export const refreshJournalsAtom = atom(
    null, // No read function (write-only atom)
    async (get, set) => {
      // Set loading state
      set(journalsAtom, { data: [], isLoading: true, error: null });
  
      try {
        const response = await fetch(ENDPOINTS.JOURNALS);
        if (!response.ok) throw new Error("Failed to fetch journals");
  
        const data = await response.json();
        // Update with fetched data
        set(journalsAtom, { data, isLoading: false, error: null });
      } catch (error) {
               // @ts-expect-error: Ignoring TypeScript error for unknown error type
        // Handle error
        set(journalsAtom, { data: [], isLoading: false, error: error.message });
        console.error("Error fetching journals:", error);
      }
    }
  );

export const refreshTagsAtom= atom(
null, // No read function (write-only atom)
async (get, set) => {
    const user = get(userAtom);
    if (!user?.id) return; // Skip if no user is logged in

    // Set loading state
    set(tagsAtom, { data: [], isLoading: true, error: null });

    try {
    const response = await fetch(ENDPOINTS.TAGS);
    if (!response.ok) throw new Error("Failed to fetch journals");

    const data = await response.json();

    // Update with fetched data
    set(tagsAtom, { data, isLoading: false, error: null });
    } catch (error) {
    // Handle error
    // @ts-expect-error: Ignoring TypeScript error for unknown error type
    set(tagsAtom, { data: [], isLoading: false, error: error.message });
    console.error("Error fetching", error);
    }
}
);