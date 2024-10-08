import {IChat, IManager, IMessage} from "../../interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, doc, getDoc, getDocs, query} from "../../firebase";
import serializeData from "../../Serializer";
import {serverTimestamp, setDoc, updateDoc} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {useAppSelector} from "../../hooks/redux-hooks";

// let manager:null|IManager = null
//
// const useManager = () => {
//     console.log(0)
//     manager = useAppSelector(state => state.manager.manager)
// }


function generate() {
    return `${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`;

}


interface IState {
    chats: IChat[]
    error: string | null
    statusSend: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
    temporaryMessage: string | null
    statusChange: 'loading' | 'succeeded' | 'failed' | null
    unreadMessages: number
}

const initialState: IState = {
    chats: [],
    error: null,
    statusChange: null,
    statusSend: null,
    statusGet: null,
    temporaryMessage: null,
    unreadMessages: 0
}

export const fetchGetAllChats = createAsyncThunk(
    'chats/fetchGetAllChats',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "chat_rooms"))
            const querySnapshot = await getDocs(q)
            const chats: IChat[] = querySnapshot.docs.map(doc => {
                const serializedData = serializeData(
                    {
                        id: doc.id,
                        ...doc.data(),
                    }
                )
                return serializedData as IChat
            })
            for (const chat of chats) {
                const q_1 = query(collection(db, `chat_rooms/${chat.id}/messages`))
                const querySnapshot_1 = await getDocs(q_1)

                const messages: IMessage[] = querySnapshot_1.docs.map(doc => {
                    const serializedData = serializeData({
                        id: doc.id,
                        ...doc.data(),
                    });
                    return serializedData as IMessage
                })
                const docRef = doc(db, 'users', chat.uid)
                const data = await getDoc(docRef)
                const user = data.data()
                chat.messages = [...messages]

            }
            thunkAPI.dispatch(getAllMessages(chats))
        } catch (e) {

        }
    })

export const fetchPushNewMessage = createAsyncThunk(
    'messages/fetchPushNewMessage',
    async ({text, mid, chat_id, img}: { text: string, mid: string, chat_id: string, img: File | null }, thunkAPI) => {
        try {
            const id = generate()
            const storage = getStorage()
            const storageRef = ref(storage, `files/${img?.name}`)
            const uploadTask = uploadBytes(storageRef, img as File)
            const snapshot = await uploadTask
            const fileMetadata = snapshot.metadata
            const downloadURL = await getDownloadURL(storageRef)
            const file = {url: downloadURL, name: id + img?.name}

            const messagesRef = collection(db, `chat_rooms/${chat_id}/messages`)

            const newMessageRef = doc(messagesRef, id)
            const messageData = {
                id,
                text: text ? text : '',
                read: false,
                attachedFiles: img !== null ? [file] : [],
                creationTime: serverTimestamp(),
                uid: mid,
            }
            await setDoc(newMessageRef, messageData)
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message)
        }

    }
)

export const fetchChangeReadMessage = createAsyncThunk(
    'chats/fetchChangeReadMessage',
    async ({chat_id, messages_id} : {chat_id: string, messages_id: string[]}, thunkAPI) => {
        thunkAPI.dispatch(changeReadMessage({chat_id, messages_id}))
        for (const message_id of messages_id) {
            const messageDocRef = doc(db, `chat_rooms/${chat_id}/messages/${message_id}`)
            try {
                await updateDoc(messageDocRef, {
                    read: true
                })

            } catch (e: any) {
                thunkAPI.rejectWithValue(e.message)
            }
        }
    }
)

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        getAllMessages(state, action) {
            const new_chat = action.payload
            console.log('Action payload:', action.payload)
            state.chats = [...new_chat].map((chat: IChat) => {
                chat.messages.sort((a: IMessage, b: IMessage) => {
                    const timestampA = new Date(a.creationTime).getTime()
                    const timestampB = new Date(b.creationTime).getTime()
                    return timestampA - timestampB
                })
                return chat
            })
        },
        resetStatus(state) {
            state.statusSend = null
        },
        pushNewMessage(state, action) {
            const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.chat_id);
            if (chatIndex !== -1) {
                state.chats[chatIndex] = {
                    ...state.chats[chatIndex],
                    messages: [...state.chats[chatIndex].messages, action.payload.messageData]
                }
            }
        },
        setTemporaryMessage(state, action) {
            state.temporaryMessage = action.payload
        },
        removeTemporaryMessage(state) {
            state.temporaryMessage = null
        },
        changeReadMessage(state, action) {
            const { chat_id, messages_id } = action.payload;
            const chatIndex = state.chats.findIndex(chat => chat.id === chat_id);
            if (chatIndex !== -1) {
                const chat = state.chats[chatIndex];
                messages_id.forEach((messageId: string) => {
                    const messageIndex = chat.messages.findIndex(message => message.id === messageId);
                    if (messageIndex !== -1) {
                        chat.messages[messageIndex].read = true;
                    }
                });
                state.chats[chatIndex] = chat; // Update the existing chat object
            }
        }


    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    ([fetchPushNewMessage.rejected.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusSend = 'failed'
                    state.error = action.payload as string
                    console.log(state.error)
                }
            )
            .addMatcher(
                (action) =>
                    ([fetchPushNewMessage.fulfilled.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusSend = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    ([fetchPushNewMessage.pending.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusSend = 'loading'
                }
            )
            .addMatcher(
                (action) =>
                    ([fetchChangeReadMessage.rejected.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusChange = 'failed'
                    state.error = action.payload as string
                    console.log(state.error)
                }
            )
            .addMatcher(
                (action) =>
                    ([fetchChangeReadMessage.fulfilled.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusChange = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    ([fetchChangeReadMessage.pending.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusChange = 'loading'
                }
            )
    }
})

export const ChatReducer = ChatsSlice.reducer
export const {
    getAllMessages, pushNewMessage, setTemporaryMessage, removeTemporaryMessage, resetStatus, changeReadMessage
} = ChatsSlice.actions
