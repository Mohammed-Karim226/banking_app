import { SignUpParams } from "@/src/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TUserProps = {
  user: SignUpParams[];
  refetch: boolean;
  isLoggedIn: boolean;
  animation: boolean;
};

const initialState: TUserProps = {
  user: [],
  refetch: false,
  isLoggedIn: false,
  animation: true,
};

const userDataSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SignUpParams[]>) => {
      state.user = action.payload;
    },
    setFetch: (state) => {
      state.refetch = !state.refetch;
    },
    setLoggedIn: (state) => {
      state.isLoggedIn = !state.refetch;
    },
    setInitialAnimation: (state, action) => {
      state.animation = action.payload;
    },
  },
});

export const { setUser, setFetch, setLoggedIn, setInitialAnimation } =
  userDataSlice.actions;
export default userDataSlice.reducer;
