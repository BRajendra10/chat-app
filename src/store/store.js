import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/usersSlice'

export const store = configureStore({
    reducer: {
        users: userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})