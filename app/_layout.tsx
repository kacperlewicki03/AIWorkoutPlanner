import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    const profile = await AsyncStorage.getItem("userProfile");
    setIsFirstTime(profile === null);
  };

  // Czekaj na sprawdzenie danych w pamięci
  if (isFirstTime === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {/* Jeśli to pierwszy raz, onboarding jest ekranem startowym */}
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />

      {/* Główne zakładki */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal jako okno wyskakujące */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerTitle: "Oceń trening",
        }}
      />
    </Stack>
  );
}
