// Utility to generate stable item IDs based on content instead of array index
// This ensures tracking data remains consistent even when JSON data is reordered

type ItemWithName = {
  name?: string;
  title?: string;
  [key: string]: unknown;
};

export function generateItemId(prefix: string, item: string | ItemWithName): string {
  // Use the item name/title as the base for ID generation
  let baseName = '';
  
  if (typeof item === 'string') {
    baseName = item;
  } else if (item.name) {
    baseName = item.name;
  } else if (item.title) {
    baseName = item.title;
  } else {
    // Fallback to JSON stringify
    baseName = JSON.stringify(item);
  }
  
  // Clean the name to create a stable ID
  const cleanName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dashes
    .replace(/-+/g, '-')        // Replace multiple dashes with single
    .replace(/^-|-$/g, '');     // Remove leading/trailing dashes
  
  return `${prefix}-${cleanName}`;
}

// Helper functions for each section type
export const generateFoodId = (food: ItemWithName) => generateItemId('food', food);
export const generateActivityId = (activity: ItemWithName, categoryKey: string) => 
  generateItemId(`activity-${categoryKey}`, activity);
export const generateShoppingId = (location: ItemWithName) => generateItemId('shopping', location);
export const generateVaccinationId = (vaccine: ItemWithName) => generateItemId('vaccination', vaccine);