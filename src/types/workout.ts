export interface UserProfile {
  level: "beginner" | "intermediate" | "advanced";
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
  rating: number; // 1-5
  comment: string;
}
