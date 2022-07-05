import { CodeNameDictionary, IdValueDictionary } from 'orient-ui-library/library/models/dictionaries'

export function convertDictionaryToSelectOptions(
  dictionary: (CodeNameDictionary | IdValueDictionary)[],
): { value: string | number; label: string }[] {
  return dictionary.map(dict => {
    if ('id' in dict) {
      return { value: dict.id, label: dict.value }
    } else {
      return { value: dict.code, label: dict.name }
    }
  })
}
