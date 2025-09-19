import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, getDocs, collection, query, where, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

/*
    TODO: 

    1. first understand flow of chats data
    2. get chats collection data from firestore(firebase)
*/

export const fetchUserChats = createAsyncThunk(
  "chats/fetchUserChats",
  async (currentUserUid) => {
    // Step 1: get chats
    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUserUid)
    );
    const snapshot = await getDocs(q);

    // Step 2: for each chat, also fetch messages
    const chatsWithMessages = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const chatData = {
          id: docSnap.id,
          ...docSnap.data()
        };

        // fetch messages subcollection
        const messagesRef = collection(db, "chats", docSnap.id, "message");
        const messageSnap = await getDocs(messagesRef);
        const messages = messageSnap.docs.map((m) => ({
          id: m.id,
          ...m.data()
        }));

        return { ...chatData, messages };
      })
    );

    return chatsWithMessages;
  }
);

export const sendMessage = createAsyncThunk(
  "chats/sendMessage",
  async ({ chatId, senderId, message }, { rejectWithValue }) => {
    try {
      const msgData = {
        senderId,
        message,
        createdAt: serverTimestamp(),
      };

      // add message
      const msgRef = await addDoc(collection(db, "chats", chatId, "message"), msgData);

      // update chat meta
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: msgData,
        updatedAt: serverTimestamp(),
      });

      return {
        chatId,
        message: { id: msgRef.id, ...msgData },
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
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
      .addCase(sendMessage.pending, (state) => {
        state.status = "Pending..."
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        // Find the chat in state
        const chatIndex = state.chats.findIndex((c) => c.id === chatId);
        if (chatIndex !== -1) {
          // Push message to messages array
          state.chats[chatIndex].messages.push(message);
          // Update lastMessage locally too
          state.chats[chatIndex].lastMessage = {
            text: message.text,
            senderId: message.senderId,
            createdAt: message.createdAt,
          };
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
  }
})

export default chatsSlice.reducer;