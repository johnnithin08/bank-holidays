import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import dayjs from "@/lib/dayjs";
import React from "react";

export type MonthDayCardProps = {
  date?: Date | null;
  size?: "small" | "large";
};

export function MonthDayCard({ date, size = "large" }: MonthDayCardProps) {
  const d = date ? dayjs(date) : null;
  const month = d ? d.format("MMM").toUpperCase() : "—";
  const day = d ? d.format("DD") : "—";

  const isSmall = size === "small";

  return (
    <Box
      className={[
        "bg-success-500 items-center justify-center",
        isSmall
          ? "w-[60px] h-[60px] rounded-[16px]"
          : "w-[140px] h-[140px] rounded-[28px]",
      ].join(" ")}
    >
      <Text
        size={isSmall ? "sm" : "xl"}
        weight="extrabold"
        className={"text-typography-0"}
      >
        {month}
      </Text>
      <Text
        weight="black"
        className={[
          "text-typography-0",
          isSmall ? "text-[20px] -mt-0.5" : "text-[56px] mt-0.5",
        ].join(" ")}
      >
        {day}
      </Text>
    </Box>
  );
}
