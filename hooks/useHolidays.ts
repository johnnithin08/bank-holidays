import { formatHolidays } from "@/utils/formatHolidays";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

export const useHolidays = () => {
  const [serverData, setServerData] = useState<Holiday[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHolidays = async () => {
    try {
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
      setLoading(false);
      setServerData(formattedData);
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

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
    return filtered.slice(0, 5);
  }, [serverData]);

  return {
    loading,
    error,
    serverData,
    upcomingHolidays,
  };
};
