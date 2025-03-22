"use client"
import { ENDPOINTS } from '@/lib/ApiUrl';
import useSWR from 'swr';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useSetAtom } from 'jotai';
import { journalOpen } from '@/atoms/JournalEntryAtoms';

const fetcher = (url: string) => fetch(url).then(res => res.json());
  
const JournalDetails = ({id}:{id:number}) => {
    const { data, error, isLoading } = useSWR(`${ENDPOINTS.JOURNALS}/${id}`, fetcher);
  const setIsOpen=useSetAtom(journalOpen)
  if (isLoading) return <div className="p-4 text-gray-600 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="p-4 text-red-600 dark:text-red-400">Error loading entry</div>;
  if (!data) return <div className="p-4 text-gray-600 dark:text-gray-400">No journal entry found.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex justify-end">
            <Button 
                onClick={() => setIsOpen(false)} 
                className='rounded-3xl p-5 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                variant={"outline"}
            >
                <X/>
            </Button>
        </div>
      
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{data.title}</h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">{data.content}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300">
        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Word Count: {data.wordCount}</span>
        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          Entry Date: {new Date(data.entryDate).toLocaleDateString()}
        </span>
        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          Created At: {new Date(data.createdAt).toLocaleDateString()}
        </span>
        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          Updated At: {new Date(data.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Uncomment and add dark mode classes if using categories/tags */}
      {/* {data.categories?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {data.categories.category.map((category, index) => (
              <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.tags?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <span key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default JournalDetails;