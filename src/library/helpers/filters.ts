/**
 * Helpers for searching and filtering
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */


/**
 * Search for word or substring (case-insensitive)
 * TODO: add support for delimiters (maybe with recrusive search)
 */
export const searchWord = (word = '', search: string | null = '') =>
  word.toLowerCase().includes(search?.toLowerCase() ?? '')
