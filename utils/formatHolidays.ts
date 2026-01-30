import dayjs from "@/lib/dayjs";

export const formatHolidays = (json: GovUkFeed) => {
  const allEvents = [
    ...(json["england-and-wales"]?.events ?? []),
    ...(json.scotland?.events ?? []),
    ...(json["northern-ireland"]?.events ?? []),
  ];

  const seen = new Set<string>();
  const holidays: Holiday[] = [];

  allEvents.forEach((ev) => {
    const title = (ev?.title ?? "").trim();
    const date = (ev?.date ?? "").trim();

    if (!title || !date) return;
    if (!dayjs.utc(date, "YYYY-MM-DD", true).isValid()) return;

    const uniqueKey = `${date}__${title.toLowerCase()}`;
    if (seen.has(uniqueKey)) return;
    seen.add(uniqueKey);

    holidays.push({
      id: uniqueKey,
      title,
      date,
    });
  });

  holidays.sort((a, b) => a.date.localeCompare(b.date));
  return holidays;
};
