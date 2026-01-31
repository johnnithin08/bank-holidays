import { DatePicker } from "@/components/date-picker";
import { MonthDayCard } from "@/components/month-day-card";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAddToCalendar } from "@/hooks/useAddToCalendar";
import dayjs from "@/lib/dayjs";
import { HolidaysContext } from "@/providers/HolidaysProvider";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Edit = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { loading, upcomingHolidays, updateEdits } =
    useContext(HolidaysContext);
  const { addToCalendar } = useAddToCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>("");

  const holiday = useMemo(() => {
    if (!id) return null;
    const match = upcomingHolidays.find((h) => h.id === id);
    return match ?? null;
  }, [id, upcomingHolidays]);

  useEffect(() => {
    if (!holiday) {
      setSelectedDate(null);
      return;
    }
    const d = dayjs(holiday.date, "YYYY-MM-DD", true);
    setSelectedDate(d.isValid() ? d.toDate() : null);
    setTitle(holiday.title);
  }, [holiday]);

  const handleSave = () => {
    if (!holiday) return;
    if (!selectedDate) return;
    updateEdits({
      date: dayjs(selectedDate).format("YYYY-MM-DD"),
      id: holiday.id,
      title: title.trim(),
    });
    if (router.canGoBack()) router.back();
    else router.navigate("/home");
  };

  const disabled = !selectedDate || !title.trim();

  const onAddToCalendar = async () => {
    if (!holiday || !selectedDate) return;

    const res = await addToCalendar({
      title: title.trim(),
      date: dayjs(holiday.date).toDate(),
    });
    if (!res.ok) {
      Alert.alert("Couldn't save to Calendar");
      return;
    }

    Alert.alert("Saved to Calendar", "Added to your device calendar.");
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 bg-background-50">
        <Box className="bg-background-950 px-[18px] pt-[10px] pb-[20px] gap-[14px]">
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
            <MonthDayCard date={selectedDate} size="large" />
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
              className="bg-background-0 border-2 border-outline-200 rounded-xl"
            >
              <InputField
                value={title}
                className="text-typography-900 text-lg font-bold my-2"
                onChangeText={setTitle}
              />
            </Input>
          </Box>

          <Box className="gap-3 mb-6">
            <Text size="md" weight="extrabold" className="text-typography-500">
              DATE
            </Text>
            <DatePicker
              value={selectedDate ?? new Date()}
              handleSelect={(next) => setSelectedDate(next)}
              disabled={loading || !holiday}
            />
          </Box>
          <Box className="mt-auto pb-4 gap-3">
            <Button
              action="primary"
              variant="solid"
              className="h-[56px] rounded-[22px] bg-background-950 gap-3"
              onPress={handleSave}
              isDisabled={disabled}
            >
              <ButtonText className="text-white text-xl font-extrabold">
                Save Changes
              </ButtonText>
            </Button>
            <Button
              action="primary"
              variant="solid"
              className="h-[56px] rounded-[22px] bg-info-800 gap-3"
              onPress={onAddToCalendar}
              isDisabled={disabled}
            >
              <IconSymbol name="plus" size={24} color="white" />
              <ButtonText className="text-white text-xl font-extrabold">
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
