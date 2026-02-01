import dayjs from "@/lib/dayjs";
import { formatHolidays } from "@/utils/formatHolidays";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type HolidaysContextValue = {
  error: boolean;
  edits: Record<string, Holiday>;
  loading: boolean;
  refetch: () => Promise<void>;
  updateEdits: (updated: Holiday) => void;
  upcomingHolidays: Holiday[];
};

const initialData: HolidaysContextValue = {
  error: false,
  edits: {},
  loading: false,
  refetch: () => Promise.resolve(),
  updateEdits: () => {},
  upcomingHolidays: [],
};

type CachePayload = {
  cachedAt: string;
  upcoming: Holiday[];
  edits: Record<string, Holiday>;
};

export const HolidaysContext = createContext<HolidaysContextValue>(initialData);

const STORAGE_KEY = "bank-holidays";

const computeUpcoming = (
  serverData: Holiday[],
  edits: Record<string, Holiday>
): Holiday[] => {
  const start = dayjs.utc().startOf("day");
  const end = start.add(6, "month");

  const effective = serverData.map((h) => edits[h.id] ?? h);

  const filtered = effective.filter((h) => {
    const d = dayjs.utc(h.date, "YYYY-MM-DD", true);
    if (!d.isValid()) return false;
    const t = d.valueOf();
    return t >= start.valueOf() && t <= end.valueOf();
  });

  filtered.sort((a, b) => a.date.localeCompare(b.date));
  return filtered.slice(0, 5);
};

const persistCache = async (payload: CachePayload) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const HolidaysProvider = ({ children }: PropsWithChildren) => {
  const [serverData, setServerData] = useState<Holiday[]>([]);
  const [edits, setEdits] = useState<Record<string, Holiday>>({});
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHolidays = useCallback(async (): Promise<void> => {
    try {
      setError(false);
      setLoading(true);
      const res = await fetch("https://www.gov.uk/bank-holidays.json", {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch bank holidays (${res.status})`);
      }

      const json = (await res.json()) as GovUkFeed;
      if (!json || typeof json !== "object") {
        throw new Error("Invalid bank holidays feed");
      }
      const formattedData = formatHolidays(json);
      const cachedAt = dayjs().toISOString();
      setServerData(formattedData);
      persistCache({
        cachedAt,
        upcoming: computeUpcoming(formattedData, edits),
        edits,
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [edits]);

  const cachedRefresh = useCallback(async () => {
    let shouldFetch = true;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as CachePayload;
          const cacheTime = dayjs(parsed.cachedAt);
          // Fetch only if cached data is from a previous day.
          shouldFetch = cacheTime.isValid()
            ? cacheTime.isBefore(dayjs(), "day")
            : true;
          setServerData(parsed.upcoming);
          setEdits(parsed.edits);
        } catch {
          shouldFetch = true;
        }
      }
    } finally {
      if (shouldFetch) await fetchHolidays();
    }
  }, [fetchHolidays]);

  const updateEdits = useCallback(
    (updated: Holiday) => {
      setEdits((prev) => {
        const next = {
          ...prev,
          [updated.id]: updated,
        };
        persistCache({
          cachedAt: dayjs().toISOString(),
          upcoming: computeUpcoming(serverData, next),
          edits: next,
        });

        return next;
      });
    },
    [serverData]
  );

  const upcomingHolidays = useMemo(() => {
    return computeUpcoming(serverData, edits);
  }, [serverData, edits]);

  useEffect(() => {
    cachedRefresh();
  }, []);

  const value = useMemo<HolidaysContextValue>(() => {
    return {
      error,
      edits,
      loading,
      refetch: fetchHolidays,
      upcomingHolidays,
      updateEdits,
    };
  }, [loading, error, upcomingHolidays, edits, fetchHolidays, updateEdits]);

  return (
    <HolidaysContext.Provider value={value}>
      {children}
    </HolidaysContext.Provider>
  );
};
