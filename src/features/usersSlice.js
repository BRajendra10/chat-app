import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, setDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUsers = createAsyncThunk("fetchusers", async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    return usersList;
})

export const addUser = createAsyncThunk(
    "users/addUser",
    async ({ uid, displayName, email, photoURL }, { rejectWithValue }) => {
        try {
            await setDoc(doc(db, "users", uid), {
                uid,
                displayName,
                email,
                photoURL,
                online: true,
                createdAt: new Date()
            });

            // return the user object so Redux can update state immediately
            return { uid, displayName, email, photoURL, online: true };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    users: [],
    currentUser: {},
    selectedUser: {},
    status: "Pending...",
    error: null
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },

        selectUser: (state, action) => {
            state.selectedUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = "Pending...";
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = "Sucess";
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });

        builder
            .addCase(addUser.pending, (state) => {
                state.status = "Adding user...";
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.status = "User added";
                state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
})

export default userSlice.reducer;
export const { setCurrentUser, selectUser } = userSlice.actions;