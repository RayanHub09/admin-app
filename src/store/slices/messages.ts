import {IChat, IMessage} from "../../interfaces"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {collection, db, deleteDoc, doc, getDoc, getDocs, query} from "../../firebase"
import serializeData from "../../Serializer"
import {serverTimestamp, setDoc, updateDoc} from "firebase/firestore"
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"

function generate() {
    return `${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`
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
                const serializedData = serializeData({
                    id: doc.id,
                    ...doc.data()
                })
                return serializedData as IChat
            })

            for (const chat of chats) {
                const q_1 = query(collection(db, `chat_rooms/${chat.id}/messages`))
                const querySnapshot_1 = await getDocs(q_1)
                const messages: IMessage[] = querySnapshot_1.docs.map(doc => {
                    const serializedData = serializeData({
                        id: doc.id,
                        ...doc.data()
                    })
                    return serializedData as IMessage
                })
                const docRef = doc(db, 'users', chat.uid)
                const data = await getDoc(docRef)
                chat.messages = [...messages]
            }
            thunkAPI.dispatch(getAllMessages(chats))
        } catch (e:any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchPushNewMessage = createAsyncThunk(
    'messages/fetchPushNewMessage',
    async ({ text, mid, chat_id, img }: { text: string; mid: string; chat_id: string; img: File | null }, thunkAPI) => {
        try {
            const id = generate()
            const storage = getStorage()
            const storageRef = ref(storage, `files/${img?.name}`)
            const snapshot = await uploadBytes(storageRef, img as File)
            const downloadURL = await getDownloadURL(storageRef)
            const file = { uri: downloadURL, name: id + img?.name }

            const messagesRef = collection(db, `chat_rooms/${chat_id}/messages`)
            const newMessageRef = doc(messagesRef, id)
            const messageData = {
                id,
                text: text ? text : '',
                read: false,
                attachedFiles: img !== null ? [file] : [],
                creationTime: serverTimestamp(),
                uid: mid
            }
            await setDoc(newMessageRef, messageData)
            await thunkAPI.dispatch(pushNewMessage({chat_id, messageData}))
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchChangeReadMessage = createAsyncThunk(
    'chats/fetchChangeReadMessage',
    async ({ chat_id, messages_id }: { chat_id: string; messages_id: string[] }, thunkAPI) => {
        thunkAPI.dispatch(changeReadMessage({ chat_id, messages_id }))

        for (const message_id of messages_id) {
            const messageDocRef = doc(db, `chat_rooms/${chat_id}/messages/${message_id}`)
            try {
                console.log(messages_id)
                await updateDoc(messageDocRef, { read: true })
            } catch (e: any) {
                return thunkAPI.rejectWithValue(e.message)
            }
        }
    }
)
export const fetchDeleteMessage = createAsyncThunk(
    'chats/fetchDeleteMessage',
    async ({chat_id, message_id}: {chat_id: string, message_id: string}, thunkAPI) => {
        try {
            const messageRef = doc(db, `chat_rooms/${chat_id}/messages`, message_id);
            await deleteDoc(messageRef)
            await thunkAPI.dispatch(deleteMessage([chat_id, message_id]))
            console.log(123344568)
        } catch (e) {

        }
    }
)
const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        getAllMessages(state, action) {
            const new_chat = action.payload
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
            state.temporaryMessage = null
            const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.chat_id)
            if (chatIndex !== -1) {
                state.chats[chatIndex].messages.push(action.payload.messageData)
            }
        },
        setTemporaryMessage(state, action) {
            state.temporaryMessage = action.payload
        },
        changeReadMessage(state, action) {
            const { chat_id, messages_id } = action.payload
            const chatIndex = state.chats.findIndex(chat => chat.id === chat_id)
            if (chatIndex !== -1) {
                const chat = state.chats[chatIndex]
                messages_id.forEach((messageId: string) => {
                    const messageIndex = chat.messages.findIndex(message => message.id === messageId)
                    if (messageIndex !== -1) {
                        chat.messages[messageIndex].read = true
                    }
                })
                state.chats[chatIndex] = chat
            }
        },
        deleteMessage(state, action) {
            const [chat_id, message_id] = action.payload
            const chatIndex = state.chats.findIndex(chat => chat.id === chat_id)

            if (chatIndex !== -1) {
                state.chats[chatIndex].messages = state.chats[chatIndex].messages.filter(message => message.id !== message_id)
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => ([fetchPushNewMessage.rejected.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusSend = 'failed'
                    state.error = action.payload as string
                }
            )
            .addMatcher(
                (action) => ([fetchPushNewMessage.fulfilled.type].includes(action.type)),
                (state) => {
                    state.statusSend = null
                    state.error = null
                    state.temporaryMessage = null

                }
            )
            .addMatcher(
                (action) => ([fetchPushNewMessage.pending.type].includes(action.type)),
                (state) => {
                    state.statusSend = 'loading'
                }
            )
            .addMatcher(
                (action) => ([fetchChangeReadMessage.rejected.type, fetchDeleteMessage.rejected.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusChange = 'failed'
                    state.error = action.payload as string
                }
            )
            .addMatcher(
                (action) => ([fetchChangeReadMessage.fulfilled.type, fetchDeleteMessage.fulfilled.type].includes(action.type)),
                (state) => {
                    state.statusChange = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) => ([fetchChangeReadMessage.pending.type, fetchDeleteMessage.pending.type].includes(action.type)),
                (state) => {
                    state.statusChange = 'loading'
                }
            )
            .addMatcher(
                (action) => ([fetchGetAllChats.pending.type].includes(action.type)),
                (state) => {
                    state.statusGet = 'loading'
                }
            )
            .addMatcher(
                (action) => ([fetchGetAllChats.fulfilled.type].includes(action.type)),
                (state) => {
                    state.statusGet = 'succeeded'
                    state.error = null
                }
            )
            .addMatcher(
                (action) => ([fetchGetAllChats.rejected.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusGet = 'failed'
                    state.error = action.payload as string
                }
            )
    }
})

export const ChatReducer = ChatsSlice.reducer
export const {
    getAllMessages, pushNewMessage, setTemporaryMessage, resetStatus, changeReadMessage,
    deleteMessage
} = ChatsSlice.actions

