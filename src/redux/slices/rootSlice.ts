import { createSlice } from '@reduxjs/toolkit';


// #####################################################################
// Item Slice
// ---------------------------------------------------------------------
const rootSlice = createSlice({
    name: 'root',
    initialState: {
        // Item
        category: 'DEFAULT VALUE FROM INITIALSTATE',
        item: 'DEFAULT VALUE FROM INITIALSTATE',
        date_due: '2022-12-16 08:00:00',
        date_reminder: '2022-12-15 07:00:00',
        // Slack User
        slack_workspace_url: 'DEFAULT VALUE FROM INITIALSTATE',
        slack_user_id: 'DEFAULT VALUE FROM INITIALSTATE',
    },
    reducers: {
        // Item        
        chooseCategory: (state, action) => {state.category = action.payload},
        chooseItem: (state, action) => {state.item = action.payload},
        chooseDateDue: (state, action) => {state.date_due = action.payload},
        chooseDateReminder: (state, action) => {state.date_reminder = action.payload},
        // Slack User
        chooseSlackWorkspaceUrl: (state, action) => {state.slack_workspace_url = action.payload},
        chooseSlackUserId: (state, action) => {state.slack_user_id = action.payload},
    }
})

export const reducer = rootSlice.reducer;

export const {
    // Item      
    chooseCategory,
    chooseItem,
    chooseDateDue,
    chooseDateReminder,
    // Slack User
    chooseSlackWorkspaceUrl,
    chooseSlackUserId,
} = rootSlice.actions;

