import { SignUpParams } from "@/src/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TUserProps = {
  user: SignUpParams[];
};

const initialState: TUserProps = {
  user: [],
};

const userDataSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SignUpParams[]>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userDataSlice.actions;
export default userDataSlice.reducer;
