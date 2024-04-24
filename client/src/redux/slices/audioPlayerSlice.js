import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openplayer: false,
    type: "audio",
    // podid: null,
    episode: [],
    currenttime: 0,
    index: 0,
    modalOpen: false
};

const audioPlayerSlice = createSlice({
    name: 'audioplayer',
    initialState,
    reducers: {
        openPlayer: (state, action) => {
            state.openplayer = action.payload.openPlayer;
            state.type = action.payload.type;
            // state.podid = action.payload.podid;
            state.currenttime = action.payload.currenttime;
            state.index = action.payload.index;
            state.episode = action.payload.episode;
            state.modalOpen = action.payload.modalOpen;
        },
        closePlayer: (state) => {
            state.openplayer = false;
        },
        setCurrentTime: (state, action) => {
            state.currenttime = action.payload.currenttime;
        }
    }
});

export const { openPlayer, closePlayer, setCurrentTime } = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;    