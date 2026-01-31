import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import dayjs from "@/lib/dayjs";
import { HolidaysContext } from "@/providers/HolidaysProvider";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Edit = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { loading, error, upcomingHolidays } = useContext(HolidaysContext);

  const holiday = useMemo(() => {
    if (!id) return null;
    const match = upcomingHolidays.find((h) => h.id === id);
    return match ?? null;
  }, [id, upcomingHolidays]);

  const dateInfo = useMemo(() => {
    if (!holiday) return null;
    const d = dayjs.utc(holiday.date, "YYYY-MM-DD", true);
    if (!d.isValid()) return null;
    return {
      month: d.format("MMM").toUpperCase(),
      day: d.format("DD"),
      full: d.format("dddd, MMMM D, YYYY"),
    };
  }, [holiday]);

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 bg-background-50">
        <Box className="bg-background-950 px-[18px] pt-[10px] pb-[16px] gap-[14px]">
          <Button
            variant="link"
            action="secondary"
            className="px-0 justify-start"
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/home");
            }}
          >
            <IconSymbol
              name="chevron.left"
              size={22}
              color="rgb(212,212,212)"
            />
            <ButtonText className="text-typography-200 text-base font-semibold">
              Back to list
            </ButtonText>
          </Button>

          <Text size="4xl" weight="extrabold" className="text-typography-0">
            Holiday Details
          </Text>
        </Box>

        <Box className="flex-1 px-6 pt-8">
          <Box className="items-center mb-6">
            <Box className="w-[140px] h-[140px] rounded-[28px] bg-success-500 items-center justify-center shadow-lg">
              <Text size="xl" weight="extrabold" className="text-typography-0">
                {dateInfo?.month ?? "—"}
              </Text>
              <Text
                weight="black"
                className="text-typography-0 text-[56px] mt-0.5"
              >
                {dateInfo?.day ?? "—"}
              </Text>
            </Box>
          </Box>

          <Box className="gap-3 mb-6">
            <Text
              size="md"
              weight="extrabold"
              className="text-typography-500 tracking-widest"
            >
              HOLIDAY NAME
            </Text>
            <Input
              variant="outline"
              size="xl"
              className="bg-background-0 border-2 border-outline-200 rounded-xl px-2 py-6"
            >
              <InputField
                value={holiday?.title ?? ""}
                className="text-typography-900 text-[18px] font-bold"
              />
            </Input>
          </Box>

          <Box className="gap-3 mb-6">
            <Text size="md" weight="extrabold" className="text-typography-500">
              DATE
            </Text>
            <Input
              variant="outline"
              size="xl"
              className="bg-background-0 border-2 border-outline-200 rounded-xl px-2 py-6"
            >
              <InputField
                value={dateInfo?.full ?? ""}
                editable={false}
                className="text-typography-900 text-[18px] font-bold"
              />
            </Input>
          </Box>

          <Box className="mt-auto pb-4 gap-3">
            <Button
              action="primary"
              variant="solid"
              className="h-[74px] rounded-[22px] bg-info-800 gap-3"
              onPress={() => {}} // Will be added later
            >
              <IconSymbol name="plus" size={24} color="white" />
              <ButtonText className="text-white text-2xl font-extrabold">
                Add to Calendar
              </ButtonText>
            </Button>
            <Text
              size="md"
              weight="semibold"
              className="text-center text-typography-500"
            >
              Saves to your device calendar
            </Text>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default Edit;
