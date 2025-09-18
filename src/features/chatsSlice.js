import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

/*
    TODO: 

    1. first understand flow of chats data
    2. get chats collection data from firestore(firebase)
*/

export const fetchUserChats = createAsyncThunk(
    "chats/fetchUserChats",
    async (currentUserUid) => {
        const q = query(
            collection(db, "chats"),
            where("members", "array-contains", currentUserUid)
        );
        const snapshot = await getDocs(q);
        // convert docs to array
        const chats = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        }));

        return chats; // will be passed to slice
    }
);

const initialState = {
    chats: [],
    status: "Pending...",
    error: null
}

const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserChats.pending, (state) => {
                state.status = "Pending...";
            })
            .addCase(fetchUserChats.fulfilled, (state, action) => {
                state.status = "Success";
                state.chats = action.payload;
            })
            .addCase(fetchUserChats.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
    }
})

export default chatsSlice.reducer;