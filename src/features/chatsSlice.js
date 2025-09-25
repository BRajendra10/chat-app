import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, getDocs, deleteDoc, updateDoc, collection, query, where, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebase";

export const createChat = createAsyncThunk(
  "chats/createChat",
  async (
    { members, type, groupName = null, groupPhotoURL = null },
    { rejectWithValue }
  ) => {
    try {
      // 1️⃣ Create new chat doc
      const chatDoc = await addDoc(collection(db, "chats"), {
        type,
        members, // now array of user UIDs (including current user)
        groupName, // null if direct chat
        groupPhotoURL, // null if no group image
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
      });

      // 2️⃣ Return new chat data (no messages yet)
      return {
        id: chatDoc.id,
        groupName,
        groupPhotoURL,
        members,
        createdAt: new Date().toISOString(), // fallback for UI
        updatedAt: new Date().toISOString(),
        lastMessage: null,
        messages: [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


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

export const deleteMessage = createAsyncThunk(
  "chats/deleteMessage",
  async ({ chatId, messageId }, { rejectWithValue }) => {
    try {
      const msgRef = doc(db, "chats", chatId, "message", messageId);

      await deleteDoc(msgRef);

      return { chatId, messageId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateMessage = createAsyncThunk(
  "chats/updateMessage",
  async ({ chatId, messageId, newText }, { rejectWithValue }) => {
    try {
      const msgRef = doc(db, "chats", chatId, "message", messageId);

      await updateDoc(msgRef, {
        message: newText,
        editedAt: new Date()
      });

      return { chatId, messageId, newText };
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
    // fetch chats data
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

    // send message
    builder
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

    // create new chat(start new chat)
    builder
      .addCase(createChat.pending, (state) => {
        state.status = "Pending...";
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.status = "Success";
        // Add the new chat to state
        state.chats.push(action.payload);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      // ✅ Update message
      .addCase(updateMessage.fulfilled, (state, action) => {
        const { chatId, messageId, newText } = action.payload;
        const chatIndex = state.chats.findIndex((c) => c.id === chatId);
        if (chatIndex !== -1) {
          const msgIndex = state.chats[chatIndex].messages.findIndex(
            (m) => m.id === messageId
          );
          if (msgIndex !== -1) {
            state.chats[chatIndex].messages[msgIndex].message = newText;
            state.chats[chatIndex].messages[msgIndex].editedAt = new Date();
          }
        }
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

    builder
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { chatId, messageId } = action.payload;
        const chatIndex = state.chats.findIndex((c) => c.id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].messages = state.chats[chatIndex].messages.filter(
            (m) => m.id !== messageId
          );
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
})

export default chatsSlice.reducer;