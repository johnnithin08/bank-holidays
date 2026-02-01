import { DatePicker } from "@/components/date-picker";
import dayjs from "@/lib/dayjs";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";

function createDateTimeSetEvtParams(date: Date) {
  return [
    { type: "set", nativeEvent: { timestamp: date.getTime() } },
    date,
  ] as const;
}

describe("DatePicker", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, "OS", {
      value: originalOS,
      configurable: true,
    });
  });

  it("iOS: opens modal, updates draft on change, calls handleSelect on Done", async () => {
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });

    const handleSelect = jest.fn();
    const date = new Date(2025, 11, 26);
    const nextDate = new Date(2025, 11, 27);
    const label = dayjs(date).format("dddd, MMMM D, YYYY");

    const screen = render(
      <DatePicker value={date} handleSelect={handleSelect} />
    );

    fireEvent.press(screen.getByText(label));

    expect(screen.getByText("Select date")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();

    const picker = await screen.findByTestId("dateTimePicker");
    await act(async () => {
      fireEvent(picker, "onChange", ...createDateTimeSetEvtParams(nextDate));
    });

    await act(async () => {
      fireEvent.press(screen.getByText("Done"));
    });

    await waitFor(() => {
      expect(handleSelect).toHaveBeenCalledWith(nextDate);
    });
  });

  it("iOS: Cancel closes without calling handleSelect", () => {
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });

    const handleSelect = jest.fn();
    const date = new Date(2025, 11, 26);
    const label = dayjs(date).format("dddd, MMMM D, YYYY");

    const screen = render(
      <DatePicker value={date} handleSelect={handleSelect} />
    );

    fireEvent.press(screen.getByText(label));
    fireEvent.press(screen.getByText("Cancel"));

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("Android: opens native picker and commits immediately on change", async () => {
    Object.defineProperty(Platform, "OS", {
      value: "android",
      configurable: true,
    });

    const handleSelect = jest.fn();
    const date = new Date(2025, 11, 26);
    const nextDate = new Date(2025, 11, 27);
    const label = dayjs(date).format("dddd, MMMM D, YYYY");

    const screen = render(
      <DatePicker value={date} handleSelect={handleSelect} />
    );

    fireEvent.press(screen.getByText(label));
    const picker = await screen.findByTestId("dateTimePicker");

    await act(async () => {
      fireEvent(picker, "onChange", ...createDateTimeSetEvtParams(nextDate));
    });

    await waitFor(() => {
      expect(handleSelect).toHaveBeenCalledWith(nextDate);
    });
  });
});
