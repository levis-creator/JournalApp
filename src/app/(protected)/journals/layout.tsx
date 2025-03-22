"use client"
import { journalOpen } from '@/atoms/JournalEntryAtoms';
import { useAtomValue } from 'jotai';
import React from 'react';

const JournalLayout = ({
    children,
    journal,
}: {
    children: React.ReactNode;
    journal: React.ReactNode;
}) => {
    const isOpen = useAtomValue(journalOpen)
    return (
        <div className="flex h-[calc(100vh-150px)] dark:bg-gray-900">
            {/* Left side (main content) */}
            <div className="flex-1 overflow-y-auto pr-5 dark:bg-gray-900 dark:text-gray-100">
                {children}
            </div>
            {isOpen && (
                <>
                    {/* Right side (desktop view) */}
                    <div className="hidden md:block md:w-1/3 lg:w-1/4 bg-gray-100 dark:bg-gray-800 overflow-y-auto dark:text-gray-200">
                        {journal}
                    </div>

                    {/* Modal (mobile view) */}
                    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 dark:bg-opacity-70">
                        <div className="fixed inset-0 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-800 w-full h-full overflow-y-auto dark:text-gray-200">
                                {journal}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default JournalLayout;