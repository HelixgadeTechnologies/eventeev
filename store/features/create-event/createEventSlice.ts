import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEventState, createEventData } from "@/types/create-event";

const initialFormData: createEventData = {
  name: "",
  description: "",
  startDate: "",
  stopDate: "",
  startTime: "",
  stopTime: "",
  recurrentEvent: false,
  thumbnail: null,
  eventType: "virtual",
  location: "",
  category: "conference",
  website: "",
  facebookUrl: "",
  instagramUrl: "",
  xUrl: "",
};

const initialState: createEventState = {
  loading: false,
  step: 1,
  showForm: false,
  formData: initialFormData,
};

export const createEventSlice = createSlice({
  name: "createEvent",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setNextStep: (state) => {
      state.step += 1
    },
    setPrevStep: (state) => {
      state.step -= 1
    },
    setShowForm: (state, action: PayloadAction<boolean>) => {
      state.showForm = action.payload
    },
    updateForm: (state, action: PayloadAction<Partial<createEventData>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetForm: (state) => {
      state.formData = initialFormData
    },
  }
})

export const { setLoading, setNextStep, setPrevStep, setShowForm, updateForm } = createEventSlice.actions;
export default createEventSlice.reducer