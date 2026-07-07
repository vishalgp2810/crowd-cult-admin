import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventsApi } from "@/lib/api/eventsApi";
import type { HostedEventUpsertPayload, ListEventsParams } from "./eventTypes";

const toErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export const fetchEventsThunk = createAsyncThunk(
  "events/fetchList",
  async (params: ListEventsParams | undefined, { rejectWithValue }) => {
    try {
      return await eventsApi.list(params);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const fetchEventByIdThunk = createAsyncThunk(
  "events/fetchById",
  async (hostedEventId: number, { rejectWithValue }) => {
    try {
      return await eventsApi.getById(hostedEventId);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const createEventThunk = createAsyncThunk(
  "events/create",
  async (payload: HostedEventUpsertPayload, { rejectWithValue }) => {
    try {
      return await eventsApi.create(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const updateEventThunk = createAsyncThunk(
  "events/update",
  async (
    arg: { hostedEventId: number; payload: HostedEventUpsertPayload },
    { rejectWithValue }
  ) => {
    try {
      return await eventsApi.update(arg.hostedEventId, arg.payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const publishEventThunk = createAsyncThunk(
  "events/publish",
  async (hostedEventId: number, { rejectWithValue }) => {
    try {
      return await eventsApi.publish(hostedEventId);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const unpublishEventThunk = createAsyncThunk(
  "events/unpublish",
  async (hostedEventId: number, { rejectWithValue }) => {
    try {
      return await eventsApi.unpublish(hostedEventId);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const deactivateEventThunk = createAsyncThunk(
  "events/deactivate",
  async (hostedEventId: number, { rejectWithValue }) => {
    try {
      await eventsApi.deactivate(hostedEventId);
      return hostedEventId;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);
