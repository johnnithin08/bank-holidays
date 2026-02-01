import Edit from "@/app/edit";
import dayjs from "@/lib/dayjs";
import { HolidaysContext } from "@/providers/HolidaysProvider";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform } from "react-native";

const mockAddToCalendar = jest.fn();
jest.mock("@/hooks/useCalendar", () => ({
  useCalendar: () => ({
    exists: false,
    addToCalendar: mockAddToCalendar,
    permission: { granted: true },
  }),
}));

function createDateTimeSetEvtParams(date: Date) {
  return [
    { type: "set", nativeEvent: { timestamp: date.getTime() } },
    date,
  ] as const;
}

describe("Edit screen", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    (useLocalSearchParams as unknown as jest.Mock).mockReturnValue({
      id: "h1",
    });
    mockAddToCalendar.mockReset();
    mockAddToCalendar.mockResolvedValue({ ok: true, eventId: "e1" });
  });

  afterEach(() => {
    Object.defineProperty(Platform, "OS", {
      value: originalOS,
      configurable: true,
    });
  });

  it("keeps Save disabled until changes; saves title and date on confirm", async () => {
    Object.defineProperty(Platform, "OS", {
      value: "android",
      configurable: true,
    });

    const updateEdits = jest.fn();

    const upcomingHolidays: Holiday[] = [
      { id: "h1", title: "Boxing Day", date: "2025-12-26" },
    ];

    const { getByDisplayValue, getByTestId, getByText, queryByText } = render(
      <HolidaysContext.Provider
        value={{
          error: false,
          edits: {},
          loading: false,
          refetch: jest.fn(),
          updateEdits,
          upcomingHolidays,
        }}
      >
        <Edit />
      </HolidaysContext.Provider>
    );

    expect(getByDisplayValue("Boxing Day")).toBeTruthy();

    fireEvent.press(getByTestId("saveChangesButton"));
    expect(queryByText("Save changes?")).toBeNull();

    fireEvent.changeText(getByDisplayValue("Boxing Day"), "Boxing Day Edited");

    fireEvent.press(getByTestId("saveChangesButton"));
    expect(queryByText("Save changes?")).toBeTruthy();
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(updateEdits).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          id: "h1",
          title: "Boxing Day Edited",
          date: "2025-12-26",
        })
      );
    });

    const initialLabel = dayjs(new Date(2025, 11, 26)).format(
      "dddd, MMMM D, YYYY"
    );
    const nextDate = new Date(2025, 11, 31);

    fireEvent.press(getByText(initialLabel));
    const picker = await waitFor(() => getByTestId("dateTimePicker"));
    act(() => {
      fireEvent(picker, "onChange", ...createDateTimeSetEvtParams(nextDate));
    });

    fireEvent.press(getByTestId("saveChangesButton"));
    expect(queryByText("Save changes?")).toBeTruthy();
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(updateEdits).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          id: "h1",
          title: "Boxing Day Edited",
          date: "2025-12-31",
        })
      );
    });
  });

  it("calls addToCalendar with current title and selected date", async () => {
    const updateEdits = jest.fn();

    const upcomingHolidays: Holiday[] = [
      { id: "h1", title: "Boxing Day", date: "2025-12-26" },
    ];

    const { getByDisplayValue, getByTestId } = render(
      <HolidaysContext.Provider
        value={{
          error: false,
          edits: {},
          loading: false,
          refetch: jest.fn(),
          updateEdits,
          upcomingHolidays,
        }}
      >
        <Edit />
      </HolidaysContext.Provider>
    );

    expect(getByDisplayValue("Boxing Day")).toBeTruthy();

    fireEvent.press(getByTestId("addToCalendarButton"));

    await waitFor(() => {
      expect(mockAddToCalendar).toHaveBeenCalledWith({
        title: "Boxing Day",
        date: new Date(2025, 11, 26),
      });
    });
  });
});
