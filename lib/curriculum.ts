/**
 * Programme.curriculum is stored as a JSON-stringified array of module names.
 *
 * Programmes saved through the admin panel were previously stringified twice
 * (once in the browser, again in the API), so a stored value can be a JSON
 * string that itself contains the JSON array. These helpers accept any of
 * those shapes.
 */

/** Read a stored or submitted curriculum value as a list of module names. */
export function parseCurriculum(value: unknown): string[] {
  let current = value;
  // unwrap up to a few levels of JSON-in-a-string
  for (let i = 0; i < 3 && typeof current === 'string'; i++) {
    try {
      current = JSON.parse(current);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(current)) return [];
  return current
    .filter((item) => item !== null && item !== undefined)
    .map((item) => String(item).trim())
    .filter((item) => item !== '');
}

/** Normalise a submitted curriculum (array or JSON string) into the stored format. */
export function serializeCurriculum(value: unknown): string {
  return JSON.stringify(parseCurriculum(value));
}
