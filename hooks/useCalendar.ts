import dayjs from "@/lib/dayjs";
import * as Calendar from "expo-calendar";
import { useCallback, useEffect, useState } from "react";

type AddToCalendarInput = {
  title: string;
  date: Date;
  notes?: string;
};

type AddToCalendarResult =
  | { ok: true; eventId: string }
  | { ok: false; error: string };

const getCalendarId = async (): Promise<string | null> => {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const writable =
    calendars.find((c) => c.allowsModifications) ??
    calendars.find((c) => c.isPrimary) ??
    calendars[0];
  return writable?.id ?? null;
};

export const useCalendar = (
  holiday: Holiday | null,
  edits: Record<string, Holiday>
) => {
  const [permission, requestPermission] = Calendar.useCalendarPermissions();
  const [exists, setExists] = useState<boolean>(false);

  const addToCalendar = useCallback(
    async ({
      title,
      date,
      notes,
    }: AddToCalendarInput): Promise<AddToCalendarResult> => {
      try {
        const trimmed = (title ?? "").trim();
        if (!trimmed) {
          return { ok: false, error: "Title cannot be empty." };
        }

        if (permission?.granted !== true) {
          const currentPermission = await requestPermission();
          if (!currentPermission.granted) {
            return {
              ok: false,
              error: "Calendar permission is required to save this event.",
            };
          }
        }

        const calendarId = await getCalendarId();
        if (!calendarId) {
          return {
            ok: false,
            error: "Couldn't find a writable calendar to save the event.",
          };
        }

        const startDate = dayjs(date).startOf("day").toDate();
        const endDate = dayjs(date).add(1, "day").startOf("day").toDate();

        const eventId = await Calendar.createEventAsync(calendarId, {
          title: trimmed,
          startDate,
          endDate,
          allDay: true,
          notes: notes ?? "UK Bank Holiday",
        });

        setExists(true);
        return { ok: true, eventId };
      } catch {
        return {
          ok: false,
          error: "Couldn't save to calendar. Please try again.",
        };
      }
    },
    [permission, requestPermission]
  );

  const checkExisting = useCallback(async (): Promise<void> => {
    try {
      if (!holiday) return;

      const { date, title } = holiday;
      if (permission?.granted !== true || !holiday) {
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const calendarIds = calendars.map((c) => c.id).filter(Boolean);
      if (!calendarIds.length) {
        return;
      }

      const start = dayjs(date).startOf("day").toDate();
      const end = dayjs(date).add(1, "day").startOf("day").toDate();

      const events = await Calendar.getEventsAsync(calendarIds, start, end);
      const targetDay = dayjs(date);
      const found = events.some((ev) => {
        if (!ev?.title) return false;
        if (ev.title.trim() !== title) return false;
        if (!ev.startDate) return false;
        return dayjs(ev.startDate).isSame(targetDay, "day");
      });

      if (found) return setExists(true);
      return setExists(false);
    } catch {
      return;
    }
  }, [permission, holiday]);

  useEffect(() => {
    checkExisting();
  }, [holiday, checkExisting, edits]);

  return { addToCalendar, exists, permission };
};
