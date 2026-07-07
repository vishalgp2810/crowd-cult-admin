import { createSlice } from "@reduxjs/toolkit";
import type { HostedEventDetail, HostedEventListItem } from "./eventTypes";
import {
  createEventThunk,
  deactivateEventThunk,
  fetchEventByIdThunk,
  fetchEventsThunk,
  publishEventThunk,
  unpublishEventThunk,
  updateEventThunk,
} from "./eventsThunks";

type EventsState = {
  list: HostedEventListItem[];
  listTotal: number;
  listPage: number;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  detail: HostedEventDetail | null;
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  saveStatus: "idle" | "loading" | "succeeded" | "failed";
  publishStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: EventsState = {
  list: [],
  listTotal: 0,
  listPage: 1,
  listStatus: "idle",
  detail: null,
  detailStatus: "idle",
  saveStatus: "idle",
  publishStatus: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventsError(state) {
      state.error = null;
    },
    resetEventDetail(state) {
      state.detail = null;
      state.detailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.events;
        state.listTotal = action.payload.total;
        state.listPage = action.payload.page;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = (action.payload as string) || "Failed to load events";
      })
      .addCase(fetchEventByIdThunk.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(fetchEventByIdThunk.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchEventByIdThunk.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = (action.payload as string) || "Failed to load event";
      })
      .addCase(createEventThunk.pending, (state) => {
        state.saveStatus = "loading";
        state.error = null;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.detail = action.payload;
        state.list = [action.payload, ...state.list];
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = (action.payload as string) || "Failed to create event";
      })
      .addCase(updateEventThunk.pending, (state) => {
        state.saveStatus = "loading";
        state.error = null;
      })
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.detail = action.payload;
        state.list = state.list.map((e) =>
          e.hostedEventId === action.payload.hostedEventId ? { ...e, ...action.payload } : e
        );
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = (action.payload as string) || "Failed to update event";
      })
      .addCase(publishEventThunk.pending, (state) => {
        state.publishStatus = "loading";
      })
      .addCase(publishEventThunk.fulfilled, (state, action) => {
        state.publishStatus = "succeeded";
        state.detail = action.payload;
        state.list = state.list.map((e) =>
          e.hostedEventId === action.payload.hostedEventId ? { ...e, ...action.payload } : e
        );
      })
      .addCase(publishEventThunk.rejected, (state, action) => {
        state.publishStatus = "failed";
        state.error = (action.payload as string) || "Failed to publish event";
      })
      .addCase(unpublishEventThunk.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.list = state.list.map((e) =>
          e.hostedEventId === action.payload.hostedEventId ? { ...e, ...action.payload } : e
        );
      })
      .addCase(deactivateEventThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.hostedEventId !== action.payload);
        if (state.detail?.hostedEventId === action.payload) {
          state.detail = null;
        }
      });
  },
});

export const { clearEventsError, resetEventDetail } = eventsSlice.actions;
export default eventsSlice.reducer;
