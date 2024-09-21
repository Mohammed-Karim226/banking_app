import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "../features/userData/userDataSlice";

export const store = configureStore({
  reducer: {
    user: userDataSlice,
  },
});

export type AppStore = typeof store;
export type TRootState = ReturnType<AppStore["getState"]>;
export type TAppDispatch = AppStore["dispatch"];
