import { useState, useEffect } from 'react';

export const useFetch = <T>(uri: string) => {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!uri) {
      return;
    }

    async function getData(uri: string) {
      try {
        const response = await fetch(uri);

        const data = (await response.json()) as T;

        setData(data);
      } catch (error) {
        setError(error as Error);
      }
    }

    void getData(uri);
  }, [uri]);

  return { data, error };
};
