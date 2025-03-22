import { ENDPOINTS } from "@/lib/ApiUrl";
import { useState } from "react";
import { Button } from "../ui/button";

interface TagInputProps {
  selected: string[];
  onChange: (tags: string[]) => void;
  onAddNewTag: (tag: string) => void;
  existingTags: string[];
}

const TagInput: React.FC<TagInputProps> = ({
    selected,
    onChange,
    onAddNewTag,
    existingTags,
  }) => {
    const [inputValue, setInputValue] = useState("");
    const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
  
    const addTag = async (tag: string) => {
      setIsAddingTag(true);
      try {
        const response = await fetch(ENDPOINTS.TAGS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: tag,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create tag");
        }
  
        const newTag = await response.json();
  
        // Update the existing tags list
        onAddNewTag(newTag.name);
  
        // Add the new tag to the selected tags
        const updatedTags = [...selected, newTag.name];
        onChange(updatedTags); // Call onChange with updated tags
        console.log("Updated Tags:", updatedTags); // Log updated tags
  
        // Clear the input
        setInputValue("");
      } catch (error) {
        console.error("Error creating tag:", error);
      } finally {
        setIsAddingTag(false);
      }
    };
  
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {existingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                const newSelection = selected.includes(tag)
                  ? selected.filter((t) => t !== tag)
                  : [...selected, tag];
                onChange(newSelection);
              }}
              className={`px-3 py-1 rounded-full text-sm ${selected.includes(tag)
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(inputValue);
              }
            }}
            placeholder="Add new tag..."
            className="px-2 py-1 text-sm border rounded"
          />
          <Button
            type="button"
            onClick={() => addTag(inputValue)}
            disabled={isAddingTag} // Disable button while loading
          >
            {isAddingTag ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    );
  };
  export default TagInput;