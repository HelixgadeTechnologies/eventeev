export interface createEventData {
  name: string;
  description: string;
  startDate: string;
  stopDate: string;
  startTime: string;
  stopTime: string;
  recurrentEvent: boolean;
  thumbnail: null | File;
  eventType: "virtual" | "hybrid" | "in person";
  location: string;
  category: "conference" | "info session" | "watch party" | "workshop" | "tech talk" | "hackathon";
  website: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
}

export interface createEventState {
  loading: boolean;
  step: number;
  showForm: boolean;
  formData: createEventData;
}