import {IChat, IMessage, IOrder, IUser} from "../../interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, db, getDocs, query, doc, getDoc} from "../../firebase";
import serializeData from "../../Serializer";
import {setDoc} from "firebase/firestore";


function generate() {
    return `${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`;

}
interface IState {
    chats: IChat[]
    error: string | null
    status: 'loading' | 'succeeded' | 'failed' | null
    statusGet: 'loading' | 'succeeded' | 'failed' | null
}

const initialState:IState = {
    chats: [],
    error: null,
    status: null,
    statusGet: null
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
                console.log(user, chat.id)
                chat.messages = [...messages]
            }

            thunkAPI.dispatch(getAllMessages(chats))
        } catch (e) {

        }
    })

export const fetchPushNewMessage = createAsyncThunk(
    'messages/fetchPushNewMessage',
    async ({text, mid, chat_id}: {text: string, mid: string, chat_id: string}, thunkAPI) => {
        try {
            console.log(0)
            const messagesRef = collection(db, `chat_rooms/${chat_id}/messages`);
            const id = generate()
            const newMessageRef = doc(messagesRef, id); // generate a new document ID
            const messageData = {
                id,
                text,
                read: false,
                attachedFiles: [],
                creationTime: new Date().toISOString(),
                uid: mid,
            }
            await setDoc(newMessageRef, messageData);
            thunkAPI.dispatch(pushNewMessage({chat_id, messageData}))
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
            state.chats = [...action.payload]
        },
        pushNewMessage(state, action) {
            const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.chat_id);
            if (chatIndex !== -1) {
                state.chats[chatIndex] = {
                    ...state.chats[chatIndex],
                    messages: [...state.chats[chatIndex].messages, action.payload.messageData]
                };
            }

        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) =>
                    [fetchPushNewMessage.rejected.type].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                }
            )
            .addMatcher(
                (action) =>
                    [fetchPushNewMessage.fulfilled.type].includes(action.type),
                (state, action: PayloadAction<string>) => {
                    state.status = 'succeeded'
                    state.error = null
                }
            )
    }
})

export const ChatReducer = ChatsSlice.reducer
export const {
    getAllMessages, pushNewMessage
} = ChatsSlice.actions
