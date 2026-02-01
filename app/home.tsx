import { Text } from "@/components/ui/text";
import React, { useCallback, useContext, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  View,
} from "react-native";

import { HolidayRow } from "@/components/holiday-row";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HolidaysContext } from "@/providers/HolidaysProvider";
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

  const keyExtractor = useCallback((item: Holiday) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Holiday>) => (
      <HolidayRow item={item} index={index} />
    ),
    []
  );

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
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Home;
