import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FeedbackModal() {
  const router = useRouter();
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");

  const submitFeedback = async () => {
    // 1. Pobierz obecną historię
    const historyRaw = await AsyncStorage.getItem("workoutHistory");
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    // 2. Dodaj nową ocenę
    const newEntry = {
      date: new Date().toISOString(),
      rating,
      comment,
    };

    await AsyncStorage.setItem(
      "workoutHistory",
      JSON.stringify([...history, newEntry])
    );

    // 3. Usuń aktualny plan (żeby jutro wygenerować nowy)
    await AsyncStorage.removeItem("currentWorkout");

    router.back(); // Zamknij modal i wróć do (tabs)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jak poszło?</Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)}>
            <Text style={{ fontSize: 40 }}>{s <= rating ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Coś za trudne? Za łatwe?"
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.btn} onPress={submitFeedback}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Zapisz i zakończ dzień
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  starRow: { flexDirection: "row", marginBottom: 30 },
  input: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#34C759",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
});
