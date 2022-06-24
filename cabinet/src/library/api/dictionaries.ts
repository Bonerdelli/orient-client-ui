import {get} from 'orient-ui-library/library';
import {Dictionaries} from 'library/models/dictionaries';

// todo: add typings
export async function getDictionaries() {
  return await get<Dictionaries>('/dictionary/all');
}

// replace string param with dict name type or enum
export async function getDictionary(name: keyof Dictionaries) {
  return await get(`/dictionary/${name}`);
}
