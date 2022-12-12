import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './slices/rootSlice';


export const store = configureStore({
    reducer,
    devTools: true
})