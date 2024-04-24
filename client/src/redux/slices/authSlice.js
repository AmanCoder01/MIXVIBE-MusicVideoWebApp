import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem('user')) : null,
    signupData: null,
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
    }
})


export const { setUserProfile, setSignupData } = authSlice.actions;
export default authSlice.reducer;