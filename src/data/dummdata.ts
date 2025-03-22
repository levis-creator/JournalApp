export const journalEntries = [
    {
      id: "1a2b3c4d",
      title: "Sunset at the Beach",
      content: "Today's sunset was breathtaking. The way the colors reflected on the water reminded me how important it is to appreciate nature's beauty. We built sandcastles and collected seashells...",
      entryDate: new Date("2024-03-18T17:30:00"),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-123",
      wordCount: 68,
      categories: [
        { category: { id: "cat-1", name: "Travel", color: "#FF6B6B" } },
        { category: { id: "cat-2", name: "Family", color: "#45B7D1" } }
      ],
      tags: [
        { tag: { id: "tag-1", name: "Vacation" } },
        { tag: { id: "tag-2", name: "Memories" } }
      ]
    },
    {
      id: "5e6f7g8h",
      title: "Project Breakthrough",
      content: "Finally solved the persistent bug in the authentication flow! Key learnings: proper error handling in async functions and JWT expiration timing. Documented everything for the team...",
      entryDate: new Date("2024-03-17T14:15:00"),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-456",
      wordCount: 52,
      categories: [
        { category: { id: "cat-3", name: "Work", color: "#4ECDC4" } },
        { category: { id: "cat-4", name: "Technical", color: "#2EC4B6" } }
      ],
      tags: [
        { tag: { id: "tag-3", name: "Programming" } },
        { tag: { id: "tag-4", name: "Success" } }
      ]
    },
    {
      id: "9i0j1k2l",
      title: "Morning Meditation",
      content: "Started new mindfulness routine: 20 minutes of meditation followed by journaling. Noticed improved focus throughout the day. Need to experiment with different techniques...",
      entryDate: new Date("2024-03-16T07:00:00"),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user-789",
      wordCount: 45,
      categories: [
        { category: { id: "cat-5", name: "Personal", color: "#FF9F1C" } },
        { category: { id: "cat-6", name: "Health", color: "#2EC4B6" } }
      ],
      tags: [
        { tag: { id: "tag-5", name: "Self-Care" } },
        { tag: { id: "tag-6", name: "Routine" } }
      ]
    }
  ];