import {useAppSelector} from "./redux-hooks";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

export function useAuth() {
    const {email, token, id} = useAppSelector(state => state.worker);

    return {
        isAuth: !!email,
        email,
        token,
        id,
    };
}

export const login = async () => {
    try {
        const auth = getAuth()
        const userCredential = await signInWithEmailAndPassword(auth, 'bul@gmail.ru', '123456');
        console.log('User logged in:', userCredential.user);
    } catch (error) {
        console.error('Error logging in:', error);
    }
};