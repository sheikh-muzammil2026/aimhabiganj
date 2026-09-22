/**
 * Utility functions for academic subject formatting and display mapping.
 */

/**
 * Maps database subject names to shortened display names for UI table headers and result sheets.
 *
 * Rules:
 * 1. If subject name is "বাংলাদেশ ও বিশ্ব পরিচয়" (or "বাংলাদেশ ও বিশ্বপরিচয়"), display as "বাউবি".
 * 2. If subject name starts with or contains "হিফজুল কুরআন ও তাজভীদ" (with any trailing codes like ০১, ০২, etc.), display strictly as "হি. কু. ও তাজভীদ".
 * 3. All other subject names are displayed as-is.
 *
 * @param {string} name - Raw subject name from database or syllabus
 * @returns {string} Formatted/shortened subject name for UI display
 */
export function formatSubjectName(name) {
  if (!name || typeof name !== "string") return "";
  const trimmed = name.trim();

  // Rule 1: বাংলাদেশ ও বিশ্ব পরিচয় / বাংলাদেশ ও বিশ্বপরিচয় -> বাউবি
  if (
    trimmed === "বাংলাদেশ ও বিশ্ব পরিচয়" ||
    trimmed === "বাংলাদেশ ও বিশ্বপরিচয়" ||
    /^বাংলাদেশ\s*ও\s*বিশ্ব\s*পরিচয়$/u.test(trimmed)
  ) {
    return "বাউবি";
  }

  // Rule 2: হিফজুল কুরআন ও তাজভীদ (starts with or contains, e.g. হিফজুল কুরআন ও তাজভীদ ০১, ০২, ০৩, etc.) -> হি. কু. ও তাজভীদ
  if (
    trimmed.includes("হিফজুল কুরআন ও তাজভীদ") ||
    /হিফজুল\s*কুরআন\s*ও\s*তাজভীদ/u.test(trimmed)
  ) {
    return "হি. কু. ও তাজভীদ";
  }

  return trimmed;
}
