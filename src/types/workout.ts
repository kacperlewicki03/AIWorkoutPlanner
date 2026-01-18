export interface UserProfile {
  level: "początkujący" | "średniozaawansowany" | "zaawansowany";
  goal: string;
  equipment: string[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  note: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface WorkoutFeedback {
  rating: number;
  comment: string;
}
