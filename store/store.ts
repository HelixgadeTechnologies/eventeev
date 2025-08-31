import { configureStore } from "@reduxjs/toolkit";
import createEventReducer from "./features/create-event/createEventSlice";

export const store = configureStore({
  reducer: {
    createEvent: createEventReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store