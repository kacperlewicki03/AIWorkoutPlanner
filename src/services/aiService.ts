import axios from "axios";
import { UserProfile, WorkoutFeedback } from "../types/workout";

const GEMINI_API_KEY = "";
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const generateAIWorkout = async (
  profile: UserProfile,
  history: WorkoutFeedback[]
) => {
  const historyContext =
    history.length > 0
      ? `Ostatnie oceny: ${history.map((h) => h.rating).join(", ")}. Uwagi: ${
          history[history.length - 1]?.comment
        }`
      : "Brak historii.";

  const promptText = `
    Jesteś trenerem fitness. Wygeneruj plan treningowy w formacie JSON.
    Użytkownik: Poziom ${profile.level}, Cel: ${
    profile.goal
  }, Sprzęt: ${profile.equipment.join(", ")}.
    Historia: ${historyContext}

    Zasady:
    1. Odpowiedz WYŁĄCZNIE czystym obiektem JSON.
    2. Struktura: {"title": "Nazwa", "exercises": [{"name": "ex", "sets": 3, "reps": "12", "note": "tip"}]}
  `;

  try {
    const response = await axios.post(
      BASE_URL,
      {
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    if (
      response.data.candidates &&
      response.data.candidates[0].content.parts[0].text
    ) {
      const responseText = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(responseText);
    }

    return null;
  } catch (error: any) {
    console.error(
      "Błąd zapytania do Gemini:",
      error.response?.data || error.message
    );
    return null;
  }
};
