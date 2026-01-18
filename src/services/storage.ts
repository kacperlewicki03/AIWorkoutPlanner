import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, WorkoutFeedback, WorkoutPlan } from "../types/workout";

const KEYS = {
  PROFILE: "userProfile",
  WORKOUT: "currentWorkout",
  HISTORY: "workoutHistory",
};

export const storageService = {
  async saveProfile(profile: UserProfile) {
    try {
      await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error("Błąd zapisu profilu", e);
    }
  },

  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Błąd odczytu profilu", e);
      return null;
    }
  },

  async saveCurrentWorkout(plan: WorkoutPlan) {
    await AsyncStorage.setItem(KEYS.WORKOUT, JSON.stringify(plan));
  },

  async getCurrentWorkout(): Promise<WorkoutPlan | null> {
    const data = await AsyncStorage.getItem(KEYS.WORKOUT);
    return data ? JSON.parse(data) : null;
  },

  async clearCurrentWorkout() {
    await AsyncStorage.removeItem(KEYS.WORKOUT);
  },

  async getHistory(): Promise<WorkoutFeedback[]> {
    const data = await AsyncStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  async addHistoryEntry(entry: WorkoutFeedback) {
    const currentHistory = await this.getHistory();
    const newHistory = [...currentHistory, entry];
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(newHistory));
  },

  async clearHistory() {
    await AsyncStorage.removeItem(KEYS.HISTORY);
  },
};
