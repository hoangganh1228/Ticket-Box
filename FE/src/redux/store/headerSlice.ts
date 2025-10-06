import { createSlice } from "@reduxjs/toolkit";

interface LoginAndRegisterState {
    showLogin: boolean;
    showRegister: boolean;
    redirectHome: boolean;
    searchValue: string;
}

const initialState: LoginAndRegisterState = {
    showLogin: false,
    showRegister: false,
    redirectHome: false,
    searchValue: '',
};

const headerSlice = createSlice({
    name: "header",
    initialState,
    reducers: {
        openLogin: (state) => {
            state.showLogin = true;
            state.showRegister = false;
        },
        closeLogin: (state) => {
            state.showLogin = false;
        },
        openRegister: (state) => {
            state.showRegister = true;
            state.showLogin = false;
        },
        closeRegister: (state) => {
            state.showRegister = false;
        },
        setSearchValue: (state, action) => {
            state.searchValue = action.payload;
        }
    },
});

export const { openLogin, closeLogin, openRegister, closeRegister, setSearchValue } = headerSlice.actions;
export default headerSlice.reducer;
