/**
 * Parses a speciality string from the database into an array of specialties
 * Handles various formats: JSON arrays, comma-separated strings, or single values
 */
export const parseSpecialities = (specialityString: string | null): string[] => {
  if (!specialityString) return [];
  
  try {
    // Try to parse as JSON if it looks like an array
    if (specialityString.startsWith('[') && specialityString.endsWith(']')) {
      return JSON.parse(specialityString);
    }
    // Otherwise, split by commas if it's a comma-separated string
    return specialityString.split(',').map(s => s.trim());
  } catch (error) {
    console.error('Error parsing specialities:', error);
    return [specialityString]; // Return as single item array if parsing fails
  }
};
