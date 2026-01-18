import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    try {
      const rawData = await AsyncStorage.getItem("workoutHistory");
      if (rawData) {
        const parsedData = JSON.parse(rawData);
        setHistory(parsedData.reverse());
      }
    } catch (e) {
      console.error("Błąd wczytywania historii", e);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      "Reset Historii",
      "Czy na pewno chcesz usunąć wszystkie zapisane treningi?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("workoutHistory");
            setHistory([]);
          },
        },
      ],
    );
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Twoje Postępy</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearBtn}>Wyczyść</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Brak historii treningów.</Text>
          <Text style={styles.subText}>Wykonaj swój pierwszy plan!</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.stars}>{renderStars(item.rating)}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.label}>Komentarz:</Text>
              <Text style={styles.comment}>
                {item.comment ? item.comment : "Brak uwag."}
              </Text>

              <Text style={styles.aiInfo}>
                {item.rating < 3
                  ? "📉 AI zmniejszy trudność następnego treningu."
                  : item.rating > 3
                    ? "📈 AI zwiększy intensywność."
                    : "✅ Utrzymanie poziomu."}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: { fontSize: 28, fontWeight: "bold", color: "#1A1A1A" },
  clearBtn: { color: "red", fontSize: 14 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#333" },
  subText: { fontSize: 14, color: "#999", marginTop: 5 },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 14, color: "#888", fontWeight: "600" },
  stars: { fontSize: 16 },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 },
  label: {
    fontSize: 12,
    color: "#BBB",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  comment: { fontSize: 16, color: "#333", fontStyle: "italic" },
  aiInfo: {
    marginTop: 15,
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#F0F7FF",
    padding: 8,
    borderRadius: 5,
    overflow: "hidden",
  },
});
