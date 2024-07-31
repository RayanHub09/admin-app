import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/use-auth";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import {db, login} from '../firebase'
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
interface Item {
    id: string;
    email: string,
    isAdmin: boolean
}
const MainPage = () => {
    const navigation = useNavigate()
    const {isAuth, email} = useAuth()
    const [items, setItems] = useState<Item[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await login();
                const querySnapshot = await getDocs(collection(db, 'workers'));

                const itemsList: Item[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data() as Item; // Приведение типа данных
                    return {
                        id: doc.id,
                        email: data.email,
                        isAdmin: data.isAdmin
                    };
                });
                setItems(itemsList);
            } catch (error) {
                console.error('Error fetching data: ', error);

            }
        };

        fetchData().then(r => console.log(items));
    }, []);
    return isAuth ? (
        <div className={'main_container'}>
            <NavBar />
            <div className={'workspace'}>
                <Header />
            </div>

        </div>
    ) : (
        <Navigate to='/signin' />
    )
};

export default MainPage;