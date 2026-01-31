import { formatHolidays } from "@/utils/formatHolidays";
import dayjs from "dayjs";
import React, {
  createContext,
  PropsWithChildren,
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

export const HolidaysContext = createContext<HolidaysContextValue>(initialData);

export const HolidaysProvider = ({ children }: PropsWithChildren) => {
  const [serverData, setServerData] = useState<Holiday[]>([]);
  const [edits, setEdits] = useState<Record<string, Holiday>>({});
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHolidays = async (): Promise<void> => {
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
      setServerData(formattedData);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const updateEdits = (updated: Holiday) => {
    setEdits((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
  };

  const upcomingHolidays = useMemo(() => {
    const start = dayjs.utc().startOf("day");
    const end = start.add(6, "month");

    const filtered = serverData.filter((h) => {
      const d = dayjs.utc(h.date, "YYYY-MM-DD", true);
      if (!d.isValid()) return false;
      const t = d.valueOf();
      return t >= start.valueOf() && t <= end.valueOf();
    });

    filtered.sort((a, b) => a.date.localeCompare(b.date));
    return filtered.slice(0, 5).map((eachDate) => {
      const editedDate = edits[eachDate.id];
      return editedDate ? editedDate : eachDate;
    });
  }, [serverData, edits]);

  const value = useMemo<HolidaysContextValue>(() => {
    return {
      error,
      edits,
      loading,
      refetch: fetchHolidays,
      upcomingHolidays,
      updateEdits,
    };
  }, [loading, error, upcomingHolidays, edits]);

  return (
    <HolidaysContext.Provider value={value}>
      {children}
    </HolidaysContext.Provider>
  );
};
