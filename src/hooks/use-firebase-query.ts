import { useState, useEffect, useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// useFirebaseQuery – drop-in replacement for @tanstack/react-query's useQuery
// ---------------------------------------------------------------------------

export type QueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useFirebaseQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  options?: { enabled?: boolean; initialData?: T | (() => T | undefined) },
): QueryResult<T> {
  const enabled = options?.enabled !== false;
  const initialData =
    typeof options?.initialData === "function"
      ? (options.initialData as () => T | undefined)()
      : options?.initialData;
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(enabled && initialData === undefined);
  const [error, setError] = useState<Error | null>(null);

  // Stabilise the key so we can depend on it
  const keyStr = Array.isArray(key) ? key.join("::") : key;
  // Keep latest queryFn in a ref so we don't re-fire on closure changes
  const fnRef = useRef(queryFn);
  fnRef.current = queryFn;

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [keyStr]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!enabled) return;
    void fetch();
  }, [fetch, enabled]);

  return { data, isLoading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useFirebaseQueries – replaces @tanstack/react-query's useQueries
// ---------------------------------------------------------------------------

export type QueriesItem<T> = {
  key: string;
  queryFn: () => Promise<T>;
};

export type QueriesResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
};

export function useFirebaseQueries<T>(queries: QueriesItem<T>[]): QueriesResult<T>[] {
  const [results, setResults] = useState<QueriesResult<T>[]>(() =>
    queries.map(() => ({ data: undefined, isLoading: true, error: null })),
  );

  // Build a stable key from all query keys
  const stableKey = queries.map((q) => q.key).join("::");
  const queriesRef = useRef(queries);
  queriesRef.current = queries;

  useEffect(() => {
    let cancelled = false;
    const items = queriesRef.current;

    // Re-initialise results to the correct length
    setResults(items.map(() => ({ data: undefined, isLoading: true, error: null })));

    items.forEach((q, i) => {
      q.queryFn()
        .then((data) => {
          if (cancelled) return;
          setResults((prev) => {
            const next = [...prev];
            next[i] = { data, isLoading: false, error: null };
            return next;
          });
        })
        .catch((err) => {
          if (cancelled) return;
          setResults((prev) => {
            const next = [...prev];
            next[i] = {
              data: undefined,
              isLoading: false,
              error: err instanceof Error ? err : new Error(String(err)),
            };
            return next;
          });
        });
    });

    return () => {
      cancelled = true;
    };
  }, [stableKey]);

  return results;
}

// ---------------------------------------------------------------------------
// useFirebaseMutation – replaces @tanstack/react-query's useMutation
// ---------------------------------------------------------------------------

export type MutationResult<TArgs, TResult> = {
  mutate: (args: TArgs) => void;
  mutateAsync: (args: TArgs) => Promise<TResult>;
  isPending: boolean;
  error: Error | null;
  reset: () => void;
};

export function useFirebaseMutation<TArgs = void, TResult = unknown>(options: {
  mutationFn: (args: TArgs) => Promise<TResult>;
  onSuccess?: (data: TResult) => void;
  onError?: (err: Error) => void;
}): MutationResult<TArgs, TResult> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  const mutateAsync = useCallback(async (args: TArgs): Promise<TResult> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await optsRef.current.mutationFn(args);
      optsRef.current.onSuccess?.(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      optsRef.current.onError?.(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, []);

  const mutate = useCallback(
    (args: TArgs) => {
      void mutateAsync(args).catch(() => {});
    },
    [mutateAsync],
  );

  const reset = useCallback(() => {
    setIsPending(false);
    setError(null);
  }, []);

  return { mutate, mutateAsync, isPending, error, reset };
}
