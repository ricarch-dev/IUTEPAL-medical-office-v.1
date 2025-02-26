import { useEffect, useState } from 'react';

export function usePathologies() {
  const [pathologies, setPathologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPathologies() {
      try {
        const response = await fetch('/api/patologias');
        const result = await response.json();
        if (response.ok) {
          setPathologies(result.pathologies);
        } else {
          setError(result.error);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPathologies();
  }, []);

  return { pathologies, loading, error };
}
