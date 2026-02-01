import { HolidaysProvider } from "@/providers/HolidaysProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, waitFor } from "@testing-library/react-native";
import { View } from "react-native";

const makeFeed = (events: { title: string; date: string }[]): GovUkFeed => {
  const division = { division: "x", events };
  return {
    "england-and-wales": division,
    scotland: division,
    "northern-ireland": division,
  };
};

describe("HolidaysProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-12-10T12:00:00.000Z"));

    (AsyncStorage.getItem as jest.Mock).mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
    global.fetch = jest.fn() as any;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("cached data present; same day; does not refetch (no fetch call)", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        cachedAt: "2025-12-10T01:00:00.000Z",
        upcoming: [{ id: "h1", title: "Cached Holiday", date: "2025-12-20" }],
        edits: {},
      })
    );

    render(
      <HolidaysProvider>
        <View />
      </HolidaysProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("cached data present; different day; refetches (fetch called)", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        cachedAt: "2025-12-09T23:59:59.000Z",
        upcoming: [{ id: "h1", title: "Cached Holiday", date: "2025-12-20" }],
        edits: {},
      })
    );

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () =>
        makeFeed([{ title: "Fetched Holiday", date: "2025-12-21" }]),
    });

    render(
      <HolidaysProvider>
        <View />
      </HolidaysProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
