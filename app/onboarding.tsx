import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const [level, setLevel] = useState("beginner");
  const [goal, setGoal] = useState("muscle_gain");

  const saveProfile = async () => {
    const profile = {
      level,
      goal,
      equipment: ["dumbbells", "bodyweight"],
      isFirstRun: false,
    };
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Konfiguracja Trenera AI</Text>

      <Text style={styles.label}>Twój poziom stażu:</Text>
      <View style={styles.row}>
        {["początkujący", "średniozaawansowany", "zaawansowany"].map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.chip, level === l && styles.activeChip]}
            onPress={() => setLevel(l)}
          >
            <Text style={level === l ? styles.activeText : {}}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Twój cel:</Text>
      {["budowa masy mięśniowej", "redukcja tłuszczu", "budowa siły"].map(
        (g) => (
          <TouchableOpacity
            key={g}
            style={[styles.option, goal === g && styles.activeOption]}
            onPress={() => setGoal(g)}
          >
            <Text>{g.replace("_", " ")}</Text>
          </TouchableOpacity>
        ),
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Zacznij Trenować</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 40 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 10, marginTop: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  chip: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "45%",
    alignItems: "center",
    flexGrow: 1,
    margin: 10,
  },
  activeChip: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  activeText: { color: "white" },
  option: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  activeOption: { borderColor: "#007AFF", backgroundColor: "#F0F7FF" },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 15,
    marginTop: 40,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
