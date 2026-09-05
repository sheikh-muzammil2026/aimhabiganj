/**
 * Utility functions for academic year / session handling.
 * Enforces single-year format (e.g., "2026" or "২০২৬") instead of ranged years (e.g., "2026-2027", "২০২৬-২০২৭").
 */

/**
 * Strips everything from the hyphen/dash/slash onwards and returns strictly the first starting year.
 * Handles Bengali, English, undefined/null, etc.
 *
 * @param {string|number} yearStr
 * @returns {string}
 */
export function formatAcademicYear(yearStr) {
  if (!yearStr) return "";
  return String(yearStr).split(/[-–/]/)[0].trim();
}

/**
 * Backwards-compatible aliases
 */
export const formatSession = formatAcademicYear;
export const formatBanglaYear = formatAcademicYear;

/**
 * Generates single-year dropdown options in Bengali numerals.
 *
 * @param {number} startYear e.g. 2018
 * @param {number} endYear e.g. 2026
 * @returns {string[]} e.g. ["২০২৬", "২০২৫", ..., "২০১৮"]
 */
export function getAcademicYearOptions(startYear = 2018, endYear = 2026) {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBn = (num) => String(num).replace(/\d/g, (d) => bnDigits[d]);

  const years = [];
  for (let y = endYear; y >= startYear; y--) {
    years.push(toBn(y));
  }
  return years;
}
