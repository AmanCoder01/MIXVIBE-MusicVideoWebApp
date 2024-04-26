import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem('user')) : null,
    signupData: null,
    sidebar: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserProfile(state, value) {
            state.user = value.payload;
        },
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setSidebar(state, value) {
            state.sidebar = value.payload;
        },

    }
})


export const { setUserProfile, setSignupData, setSidebar } = authSlice.actions;
export default authSlice.reducer;