import { useEffect, useState } from 'react';

export type MarketDatum = {
  timestamp: string;
  open: number;
  close: number;
  low: number;
  high: number;
};

export function useMarketData(symbol: string) {
  const [data, setData] = useState<MarketDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetch(`https://mock.apidog.com/m1/892843-874692-default/marketdata/history/${symbol}`)
      .then(res => res.json())
      .then(json => {
        if (isMounted) {
          const arr = Array.isArray(json) ? json : json.data || [];
          setData(arr.slice(0, 20));
        }
      })
      .catch(e => {
        if (isMounted) setError(e.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return { data, loading, error };
}
