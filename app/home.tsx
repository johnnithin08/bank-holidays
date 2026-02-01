import { Text } from "@/components/ui/text";
import React, { useCallback, useContext, useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";

import { MonthDayCard } from "@/components/month-day-card";
import { Box } from "@/components/ui/box";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HolidaysContext } from "@/providers/HolidaysProvider";
import dayjs from "dayjs";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { upcomingHolidays, refetch } = useContext(HolidaysContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-background-950 py-7 px-4 gap-2">
        <View className="flex-row gap-3 align-center">
          <View className="bg-success-500 rounded-xl p-2 justify-center">
            <IconSymbol name="calendar" size={24} color="white" />
          </View>
          <Text size="3xl" weight="bold" className="text-typography-0">
            Bank Holidays
          </Text>
        </View>
        <Text
          size="md"
          weight="medium"
          className="text-typography-0 text-gray-400"
        >
          United Kingdom | Next 5 holidays
        </Text>
      </View>
      <FlatList
        className="px-6 py-8"
        contentContainerClassName="gap-4"
        data={upcomingHolidays}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          return (
            <Pressable
              className="p-4 bg-white rounded-xl flex-row gap-4"
              onPress={() => {
                router.push({ pathname: "/edit", params: { id: item.id } });
              }}
            >
              <Box className="items-center">
                <MonthDayCard
                  size="small"
                  date={dayjs(item.date, "YYYY-MM-DD", true).toDate()}
                />
              </Box>
              <View className="justify-center">
                <Text size="lg" weight="bold">
                  {item.title}
                </Text>
                <Text size="md" className="text-typography-700">
                  {dayjs(item.date).format("dddd, MMMM D, YYYY")}
                </Text>
              </View>
              <View className="ml-auto justify-center">
                <IconSymbol name="chevron.right" size={16} color="gray" />
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Home;
