import dayjs from "@/lib/dayjs";
import * as Calendar from "expo-calendar";
import { useCallback } from "react";

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

export function useAddToCalendar() {
  const [permission, requestPermission] = Calendar.useCalendarPermissions();

  const addToCalendar = useCallback(
    async ({
      title,
      date,
      notes,
    }: AddToCalendarInput): Promise<AddToCalendarResult> => {
      try {
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
        const endDate = dayjs(date).endOf("day").toDate();

        const eventId = await Calendar.createEventAsync(calendarId, {
          title,
          startDate,
          endDate,
          allDay: true,
          notes: notes ?? "UK Bank Holiday",
        });

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

  return { addToCalendar, permission };
}
