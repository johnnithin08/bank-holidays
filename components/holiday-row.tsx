import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MonthDayCard } from "./month-day-card";
import { Box } from "./ui/box";
import { IconSymbol } from "./ui/icon-symbol";

export const HolidayRow = ({
  item,
  index,
}: {
  item: Holiday;
  index: number;
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(300)}
      style={animatedStyle}
    >
      <Pressable
        className="p-4 bg-white rounded-xl flex-row gap-4"
        testID={`holidayRow-${item.id}`}
        onPress={() => {
          router.push({ pathname: "/edit", params: { id: item.id } });
        }}
        onPressIn={() => {
          scale.value = withTiming(0.95, { duration: 150 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 150 });
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
    </Animated.View>
  );
};
