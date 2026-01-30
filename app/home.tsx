import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHolidays } from "@/hooks/useHolidays";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { upcomingHolidays } = useHolidays();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">UK Bank Holidays</ThemedText>
          <ThemedText>Next 5 within the next 6 months</ThemedText>
        </View>

        <FlatList
          data={upcomingHolidays}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            return (
              <Pressable style={[styles.card]}>
                <View style={styles.cardTopRow}>
                  <Text>{item.title}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    gap: 6,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
  },
  empty: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
});
