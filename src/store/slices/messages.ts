import {IChat, IMessage, IReItem} from "../../interfaces"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {addDoc, collection, db, deleteDoc, doc, getDocs, query} from "../../firebase"
import {serverTimestamp, setDoc, Timestamp, updateDoc} from "firebase/firestore"
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"
import {IRole, options} from "../../lists/roleList";

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

interface IState {
    chats: IChat[]
    paramSort: boolean | null
    isSorting: boolean
    error: string | null
    statusSend: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
    statusDeleteMessage: 'loading' | 'succeeded' | 'failed' | null
    statusDeleteChat: 'loading' | 'succeeded' | 'failed' | null
    statusCreateChat : 'loading' | 'succeeded' | 'failed' | null
    statusGetMessage: 'loading' | 'succeeded' | 'failed' | null
    temporaryMessage: string | null
    statusChange: 'loading' | 'succeeded' | 'failed' | null
    unreadMessages: number
}

const initialState: IState = {
    chats: [],
    paramSort: null,
    isSorting: false,
    error: null,
    statusDeleteMessage: null,
    statusDeleteChat: null,
    statusChange: null,
    statusSend: null,
    statusGet: null,
    statusGetMessage: null,
    statusCreateChat: null,
    temporaryMessage: null,
    unreadMessages: 0
}

export const fetchGetAllChats = createAsyncThunk(
    'chats/fetchGetAllChats',
    async (arg, thunkAPI) => {
        try {
            const q = query(collection(db, "chat_rooms"));
            const querySnapshot = await getDocs(q);
            const chats: IChat[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const serializedData = {
                    id: doc.id,
                    department: data.department,
                    theme: data.theme,
                    uid: data.uid,
                    creationDate: data.creationDate.seconds,
                    messages: []
                };
                return serializedData as IChat;
            });

            for (const chat of chats) {
                const q_1 = query(collection(db, `chat_rooms/${chat.id}/messages`));
                const querySnapshot_1 = await getDocs(q_1);
                chat.messages = querySnapshot_1.docs.map(doc => {
                    const data = doc.data();
                    const serializedMessage: IMessage = {
                        id: doc.id,
                        text: data.text,
                        read: data.read,
                        attachedFiles: data.attachedFiles,
                        creationTime: data.creationTime.seconds,
                        uid: data.uid
                    }
                    return serializedMessage;
                })
            }
            thunkAPI.dispatch(getAllMessages(chats));
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const fetchPushNewMessage = createAsyncThunk(
    'messages/fetchPushNewMessage',
    async ({ text, mid, chat_id, files }: { text: string; mid: string; chat_id: string; files: File[] | null }, thunkAPI) => {
        try {
            const storage = getStorage();
            const time = serverTimestamp();

            let uploadedFiles: { uri: string; name: string }[] = [];

            // Загружаем все файлы и получаем их URL
            if (files) {
                uploadedFiles = await Promise.all(files.map(async (file) => {
                    const storageRef = ref(storage, `files/${file.name}`);
                    await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(storageRef);
                    return { uri: downloadURL, name: `${mid}_${file.name}` };
                }));
            }

            const messagesRef = collection(db, `chat_rooms/${chat_id}/messages`);
            const newMessageRef = doc(messagesRef);

            const messageData = {
                id: newMessageRef.id,
                text: text || '',
                read: false,
                attachedFiles: uploadedFiles, // Используем загруженные файлы
                creationTime: time,
                uid: mid,
            };

            await setDoc(newMessageRef, messageData);
            return messageData;
        } catch (e: any) {
            console.error('Error pushing new message:', e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const fetchChangeReadMessage = createAsyncThunk(
    'chats/fetchChangeReadMessage',
    async ({ chat_id, messages_id }: { chat_id: string; messages_id: string[] }, thunkAPI) => {
        thunkAPI.dispatch(changeReadMessage({ chat_id, messages_id }))

        for (const message_id of messages_id) {
            const messageDocRef = doc(db, `chat_rooms/${chat_id}/messages/${message_id}`)
            try {
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
        } catch (e:any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchDeleteChat = createAsyncThunk(
    'chats/fetchDeleteMessage',
    async ({chat_id}: {chat_id: string}, thunkAPI) => {
        try {
            const messageRef = doc(db, `chat_rooms`, chat_id);
            await deleteDoc(messageRef)
            await thunkAPI.dispatch(deleteChat(chat_id))
        } catch (e:any) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchCreateChat = createAsyncThunk(
    'chats/fetchCreateChat',
    async ({theme, uid, department} : {theme : string, uid : string, department : string}, thunkAPI) => {
        try {
            const data = {
                department: department,
                theme: theme,
                uid: uid,
                creationDate: Timestamp.now(),
            }
            const docRef = await addDoc(collection(db, '/chat_rooms'), data)
            await updateDoc(docRef, {id: docRef.id})
            return docRef.id
        } catch (e:any) {
            return thunkAPI.rejectWithValue(e.message)
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
            state.temporaryMessage = null;
            const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.chat_id);
            const time = action.payload.messageData.creationTime?.seconds;
            const new_message = { ...action.payload.messageData, creationTime: time };

            if (state.chats[chatIndex].messages) {
                const messageExists = state.chats[chatIndex].messages.some(message =>
                                message.id === new_message.id)
                if (!messageExists) state.chats[chatIndex] = {...state.chats[chatIndex], messages : [...state.chats[chatIndex].messages, new_message]}
            } else {
                state.chats[chatIndex] = {...state.chats[chatIndex], messages : [new_message]}

            }
            // if (state.chats[chatIndex]?.messages) {
            //     if (state.chats[chatIndex].messages.length === 0) {
            //
            //     } else {
            //         const messages = state.chats[chatIndex].messages
            //         const messageExists = messages.some(message =>
            //             message.id === new_message.id &&
            //             message.text === new_message.text &&
            //             message.creationTime === new_message.creationTime
            //         )
            //         if (!messageExists) {
            //             state.chats[chatIndex].messages.push(new_message);
            //         }
            //     }
            //
            //
            // }

        }
        ,
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
        },

        pushNewChat(state, action) {
            const time = action.payload.newChat?.creationDate.seconds
            const new_chat = {...action.payload.newChat, creationDate : time}
            state.chats = [...state.chats, new_chat]
        },
        changeMessage(state, action) {
            const { chat_id, messageData } = action.payload;
            const find_chat = state.chats.find(chat => chat.id === chat_id);

            if (!find_chat?.messages) {
                return state;
            }

            const updatedMessages = find_chat.messages?.filter(message => message.id !== messageData?.id);
            const new_chat = {
                ...find_chat,
                messages: [...updatedMessages, messageData]
            };

            return {
                ...state,
                chats: state.chats.map(chat => chat.id === chat_id ? new_chat : chat)
            };
        },
        setParam(state, action) {
            state.isSorting = true
            state.paramSort = action.payload
        },
        resetSort(state) {
            state.isSorting = false
        },
        deleteChat(state, action) {
            state.chats = state.chats.filter(chat => chat.id !== action.payload)
        },
        createChat(state, action) {
            state.chats = [...state.chats, action.payload]
        }



    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => ([fetchDeleteChat.rejected.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusDeleteChat = 'failed'
                    state.error = action.payload as string
                }
            )
            .addMatcher(
                (action) => ([fetchDeleteChat.fulfilled.type].includes(action.type)),
                (state) => {
                    state.statusDeleteChat = null
                    state.error = null

                }
            )
            .addMatcher(
                (action) => ([fetchDeleteChat.pending.type].includes(action.type)),
                (state) => {
                    state.statusDeleteChat = 'loading'
                }
            )
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
            .addMatcher(
                (action) => ([fetchCreateChat.rejected.type].includes(action.type)),
                (state, action: PayloadAction<string>) => {
                    state.statusCreateChat = 'failed'
                    state.error = action.payload as string
                }
            )
            .addMatcher(
                (action) => ([fetchCreateChat.fulfilled.type].includes(action.type)),
                (state) => {
                    state.statusCreateChat = null
                    state.error = null

                }
            )
            .addMatcher(
                (action) => ([fetchCreateChat.pending.type].includes(action.type)),
                (state) => {
                    state.statusCreateChat = 'loading'
                }
            )
    }
})

export const ChatReducer = ChatsSlice.reducer
export const {
    getAllMessages, pushNewMessage, setTemporaryMessage, resetStatus, changeReadMessage,
    deleteMessage, pushNewChat, changeMessage, setParam, resetSort, deleteChat, createChat

} = ChatsSlice.actions

