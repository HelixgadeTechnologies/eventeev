"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { createEventState, createEventData } from "@/types/create-event";

export const initialFormData: createEventData = {
  name: "",
  description: "",
  startDate: "",
  stopDate: "",
  startTime: "",
  stopTime: "",
  recurrentEvent: false,
  thumbnail: null,
  banner: null,
  eventType: "virtual",
  location: "",
  category: "conference",
  website: "",
  facebookUrl: "",
  instagramUrl: "",
  xUrl: "",
};

export const initialCreateEventState: createEventState = {
  loading: false,
  step: 1,
  showForm: false,
  formData: initialFormData,
};

export type CreateEventAction =
  | { type: "createEvent/setLoading"; payload: boolean }
  | { type: "createEvent/setNextStep" }
  | { type: "createEvent/setPrevStep" }
  | { type: "createEvent/setShowForm"; payload: boolean }
  | { type: "createEvent/updateForm"; payload: Partial<createEventData> }
  | { type: "createEvent/resetForm" };

export const setLoading = (payload: boolean): CreateEventAction => ({
  type: "createEvent/setLoading",
  payload,
});

export const setNextStep = (): CreateEventAction => ({
  type: "createEvent/setNextStep",
});

export const setPrevStep = (): CreateEventAction => ({
  type: "createEvent/setPrevStep",
});

export const setShowForm = (payload: boolean): CreateEventAction => ({
  type: "createEvent/setShowForm",
  payload,
});

export const updateForm = (
  payload: Partial<createEventData>
): CreateEventAction => ({
  type: "createEvent/updateForm",
  payload,
});

export const resetForm = (): CreateEventAction => ({
  type: "createEvent/resetForm",
});

function createEventReducer(
  state: createEventState = initialCreateEventState,
  action: CreateEventAction
): createEventState {
  switch (action?.type) {
    case "createEvent/setLoading":
      return { ...state, loading: action.payload };
    case "createEvent/setNextStep":
      return { ...state, step: state.step + 1 };
    case "createEvent/setPrevStep":
      return { ...state, step: Math.max(1, state.step - 1) };
    case "createEvent/setShowForm":
      return { ...state, showForm: action.payload };
    case "createEvent/updateForm":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "createEvent/resetForm":
      return { ...state, formData: initialFormData };
    default:
      return state;
  }
}

export interface RootState {
  createEvent: createEventState;
}

export type AppDispatch = (action: CreateEventAction) => void;

interface CreateEventContextType {
  state: RootState;
  dispatch: React.Dispatch<CreateEventAction>;
}

const CreateEventContext = createContext<CreateEventContextType | null>(null);

export const CreateEventProvider = ({ children }: { children: ReactNode }) => {
  const [createEventState, dispatch] = useReducer(
    createEventReducer,
    initialCreateEventState
  );

  return (
    <CreateEventContext.Provider
      value={{ state: { createEvent: createEventState }, dispatch }}
    >
      {children}
    </CreateEventContext.Provider>
  );
};

export const useCreateEventContext = () => {
  const context = useContext(CreateEventContext);
  if (!context) {
    throw new Error(
      "useCreateEventContext must be used within CreateEventProvider"
    );
  }
  return context;
};

export const useAppDispatch = (): AppDispatch => {
  const { dispatch } = useCreateEventContext();
  return dispatch;
};

export function useAppSelector<T>(selector: (state: RootState) => T): T {
  const { state } = useCreateEventContext();
  return selector(state);
}
