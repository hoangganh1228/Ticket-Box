import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserState {
    email: string;
}

const initialState: UserState = {
    email: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.email = action.payload.email;
        },
    },
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;
