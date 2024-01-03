import { axios } from '@/lib/axios';

import type { Character, ResponseData } from '../types';

export const getCharacters = async (): Promise<Character[]> => {
  const response = await axios.get<ResponseData<Character[]>>('/character');

  return response.data.results || [];
};
