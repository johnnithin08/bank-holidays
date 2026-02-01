// Reanimated mock (required for Jest)
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// AsyncStorage mock
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Expo Router mock
jest.mock("expo-router", () => {
  return {
    router: {
      push: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
      replace: jest.fn(),
      navigate: jest.fn(),
    },
    useLocalSearchParams: jest.fn(() => ({})),
  };
});
