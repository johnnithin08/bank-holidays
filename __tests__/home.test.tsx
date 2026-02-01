import Home from "@/app/home";
import { HolidaysContext } from "@/providers/HolidaysProvider";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

describe("Home screen", () => {
  it("renders header and holiday rows; tapping row navigates", () => {
    const upcomingHolidays: Holiday[] = [
      { id: "h1", title: "Boxing Day", date: "2025-12-26" },
    ];

    const refetch = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByTestId } = render(
      <HolidaysContext.Provider
        value={{
          error: false,
          edits: {},
          loading: false,
          refetch,
          updateEdits: jest.fn(),
          upcomingHolidays,
        }}
      >
        <Home />
      </HolidaysContext.Provider>
    );

    expect(getByText("Bank Holidays")).toBeTruthy();

    fireEvent.press(getByTestId("holidayRow-h1"));
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/edit",
      params: { id: "h1" },
    });
  });

  it("calls refetch when pull-to-refresh triggers", () => {
    const upcomingHolidays: Holiday[] = [
      { id: "h1", title: "Boxing Day", date: "2025-12-26" },
    ];
    const refetch = jest.fn().mockResolvedValue(undefined);

    const screen = render(
      <HolidaysContext.Provider
        value={{
          error: false,
          edits: {},
          loading: false,
          refetch,
          updateEdits: jest.fn(),
          upcomingHolidays,
        }}
      >
        <Home />
      </HolidaysContext.Provider>
    );

    const list = screen.UNSAFE_getByType(FlatList);

    act(() => {
      list.props.refreshControl.props.onRefresh();
    });

    return waitFor(() => {
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });

  it("if there is an edited value, shows that value", () => {
    const upcomingHolidays: Holiday[] = [
      { id: "h1", title: "Xmas (Edited)", date: "2025-12-25" },
    ];

    const refetch = jest.fn().mockResolvedValue(undefined);

    const { getByText } = render(
      <HolidaysContext.Provider
        value={{
          error: false,
          edits: {
            h1: { id: "h1", title: "Xmas (Edited)", date: "2025-12-25" },
          },
          loading: false,
          refetch,
          updateEdits: jest.fn(),
          upcomingHolidays,
        }}
      >
        <Home />
      </HolidaysContext.Provider>
    );

    expect(getByText("Xmas (Edited)")).toBeTruthy();
  });
});
