import { createSlice } from '@reduxjs/toolkit';

const rootSlice = createSlice({
    name: 'root',
    initialState: {
        category: 'my stuff',
        item: 'my stuff details',
        date_due: '2022-12-16 08:00:00',
        date_reminder: '2022-12-15 07:00:00'
    },
    reducers: {
        chooseCategory: (state, action) => {state.category = action.payload},
        chooseItem: (state, action) => {state.item = action.payload},
        chooseDateDue: (state, action) => {state.date_due = action.payload},
        chooseDateReminder: (state, action) => {state.date_reminder = action.payload}
    }
})

export const reducer = rootSlice.reducer;

export const {
    chooseCategory,
    chooseItem,
    chooseDateDue,
    chooseDateReminder
} = rootSlice.actions;

