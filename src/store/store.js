import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/usersSlice'
import chatsSlice from '../features/chatsSlice'

export const store = configureStore({
    reducer: {
        users: userReducer,
        chats: chatsSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})