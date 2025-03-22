import { JournalEntry } from "@prisma/client";
import { format } from "date-fns"; // Correct import for date formatting
import { MoreVertical } from "lucide-react";
import Link from "next/link"; // Import Link from next/link
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSetAtom } from "jotai";
import { journalOpen } from "@/atoms/JournalEntryAtoms";

interface JournalCardProps {
  entry: JournalEntry & {
    categories?: { category: { id: number; name: string; color: string; } }[];
    tags?: { tag: { name: string } }[];
  };
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const JournalCard = ({ entry, onEdit, onDelete }: JournalCardProps) => {
  const setOpen = useSetAtom(journalOpen)
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 text-left group relative min-h-[300px] flex flex-col h-full">
      <div className="flex flex-col h-full">
        <CardHeader className="pb-2 relative z-10 bg-background">
          <div className="flex justify-between items-start">
            <div className="pr-4">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {entry.title}
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600">
                {format(new Date(entry.entryDate), "MMMM dd, yyyy")}
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 rounded-full hover:bg-gray-100 z-20 transition-colors duration-200"
                  aria-label="Entry actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg border" align="end">
                {onEdit && (
                  <DropdownMenuItem
                    className="hover:bg-gray-50 focus:bg-gray-50 transition-colors duration-150"
                    onClick={() => onEdit(entry.id)}
                  >
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive hover:bg-red-50 focus:bg-red-50 transition-colors duration-150"
                    onClick={() => onDelete(entry.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <div className="px-6 pb-4 flex-1 flex flex-col justify-between relative z-10 bg-background">
          <Link
            onClick={() => setOpen(true)}
            href={`/journals?id=${entry.id}`}
            className="block flex-1 cursor-pointer hover:underline"
          >
            <p className="text-gray-700 mb-4 line-clamp-4">
              {entry.content || "No content available"}
            </p>
          </Link>

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {entry.categories?.map(({ category }) => (
              <span
                key={category.id}
                style={{ background: `${category.color}` }}
                className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800"
              >
                {category.name}
              </span>
            ))}
            {/* {entry.tags?.map(({ tag }) => (
              <span
                key={tag.name}
                className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800"
              >
                #{tag.name}
              </span>
            ))} */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JournalCard;