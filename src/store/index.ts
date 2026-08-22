import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import artistReducer from "@/features/artist/artistSlice";
import venueReducer from "@/features/venue/venueSlice";
import adminReducer from "@/features/admin/adminSlice";
import adminUsersReducer from "@/features/adminUsers/adminUsersSlice";
import eventsReducer from "@/features/events/eventsSlice";
import menuReducer from "@/features/menu/menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artist: artistReducer,
    venue: venueReducer,
    admin: adminReducer,
    adminUsers: adminUsersReducer,
    events: eventsReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
