import useSWR from "swr";
import { ENDPOINTS } from "@/lib/ApiUrl";
import { useState } from "react";
import { Button } from "../ui/button"; // shadcn/ui Button
import { Badge } from "../ui/badge"; // shadcn/ui Badge
import Input from "../form/input/InputField";

interface Category {
  id: number;
  name: string;
  color?: string;
}

interface CategorySelectProps {
  selected: number[]; // Array of selected category IDs
  onChange: (categoryIds: number[]) => void;
  onAddNewCategory: (category: Category) => void;
}

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategorySelect: React.FC<CategorySelectProps> = ({
  selected,
  onChange,
  onAddNewCategory,
}) => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [newCategoryColor, setNewCategoryColor] = useState<string>("#3b82f6"); // Default color
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  // Fetch existing categories using useSWR
  const { data: existingCategories, mutate } = useSWR<Category[]>(
    ENDPOINTS.CATEGORIES,
    fetcher
  );

  const handleAddCategory = async () => {
    if (newCategory && !existingCategories?.some((cat) => cat.name === newCategory)) {
      setIsAddingCategory(true);
      try {
        const response = await fetch(ENDPOINTS.CATEGORIES, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCategory,
            color: newCategoryColor, // Include the selected color
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create category");
        }

        const newCategoryData: Category = await response.json();

        // Update the existing categories list
        onAddNewCategory(newCategoryData);

        // Add the new category to the selected categories
        const updatedCategoryIds = [...selected, newCategoryData.id];
        onChange(updatedCategoryIds); // Call onChange with updated category IDs
        console.log("Updated Category IDs:", updatedCategoryIds); // Log updated category IDs

        // Clear the input and reset color
        setNewCategory("");
        setNewCategoryColor("#3b82f6"); // Reset to default color

        // Revalidate the categories list
        mutate([...(existingCategories || []), newCategoryData]);
      } catch (error) {
        console.error("Error creating category:", error);
      } finally {
        setIsAddingCategory(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Display existing categories as Badges */}
      <div className="flex flex-wrap gap-2">
        {existingCategories?.map((category) => (
          <Badge
            key={category.id}
            variant={selected.includes(category.id) ? "default" : "outline"}
            style={{ backgroundColor: selected.includes(category.id) ? category.color : undefined }}
            onClick={() => {
              const newSelection = selected.includes(category.id)
                ? selected.filter((id) => id !== category.id)
                : [...selected, category.id];
              onChange(newSelection);
            }}
            className="cursor-pointer" // Make the badge clickable
          >
            {category.name}
          </Badge>
        ))}
      </div>

      {/* Input and Button for adding a new category */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category..."
            className="flex-1"
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="w-10 h-10 rounded-md cursor-pointer"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddCategory}
          disabled={isAddingCategory} // Disable button while loading
        >
          {isAddingCategory ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
};

export default CategorySelect;