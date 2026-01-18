import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { generateAIWorkout } from "../../src/services/aiService";
import { storageService } from "../../src/services/storage";
import { WorkoutPlan } from "../../src/types/workout";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);

  const checkAppData = useCallback(async () => {
    const profile = await storageService.getProfile();

    if (!profile) {
      router.replace("/onboarding");
      return;
    }

    const savedWorkout = await storageService.getCurrentWorkout();
    setWorkout(savedWorkout);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      checkAppData();
    }, [checkAppData]),
  );

  const handleGenerateWorkout = async () => {
    setLoading(true);
    try {
      const profile = await storageService.getProfile();
      const history = await storageService.getHistory();

      if (!profile) {
        Alert.alert("Błąd", "Brak profilu użytkownika.");
        return;
      }

      const newPlan = await generateAIWorkout(profile, history);

      if (newPlan) {
        await storageService.saveCurrentWorkout(newPlan);
        setWorkout(newPlan);
      } else {
        Alert.alert(
          "Błąd",
          "Nie udało się wygenerować planu. Spróbuj ponownie.",
        );
      }
    } catch (error) {
      console.error("Błąd generowania:", error);
      Alert.alert("Błąd", "Wystąpił nieoczekiwany problem.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>AI układa Twój plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!workout ? (
        <View style={styles.emptyState}>
          <Text style={styles.title}>Gotowy na trening?</Text>
          <Text style={styles.subtitle}>
            AI przygotuje plan na podstawie Twoich celów i historii.
          </Text>
          <TouchableOpacity
            style={styles.genButton}
            onPress={handleGenerateWorkout}
          >
            <Text style={styles.buttonText}>Generuj plan na dziś</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <FlatList
            data={workout.exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {item.sets} serie x {item.reps}
                  </Text>
                </View>
                {item.note && <Text style={styles.aiNote}>💡 {item.note}</Text>}
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => router.push("/modal")}
              >
                <Text style={styles.buttonText}>Trening ukończony – Oceń</Text>
              </TouchableOpacity>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
    paddingTop: 60,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1A1A1A",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  exerciseName: { fontSize: 18, fontWeight: "600" },
  exerciseDetails: {
    fontSize: 15,
    color: "#007AFF",
    marginTop: 4,
    fontWeight: "500",
  },
  aiNote: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#EEE",
    paddingTop: 8,
  },
  genButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 20,
  },
  doneButton: {
    backgroundColor: "#34C759",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
