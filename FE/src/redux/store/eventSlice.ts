import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
    id : number;
    imageUrl: string;
    name: string;
    price: number;
    day: string;
}

interface EventState { 
    suggestions: Event[];
}

const initialState : EventState = {
    suggestions : []
}

const eventSlice = createSlice({
    name : 'event',
    initialState,
    reducers : {
        setSuggestions : (state, action : PayloadAction<Event[]>) => {
             state.suggestions = action.payload;
        }
    }
})

export const { setSuggestions } = eventSlice.actions;
export default eventSlice.reducer;

