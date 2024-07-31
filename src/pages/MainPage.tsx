import React from 'react';
import {Navigate} from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import {useAppSelector} from "../hooks/redux-hooks";

const MainPage = () => {
    const status = useAppSelector(state => state.worker.status)
    // useEffect(() => {
    //     const fetchData = async () => {
    //     //     try {
    //     //         await login();
    //     //         const querySnapshot = await getDocs(collection(db, 'workers'));
    //     //
    //     //         const itemsList: Item[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    //     //             const data = doc.data() as Item; // Приведение типа данных
    //     //             return {
    //     //                 id: doc.id,
    //     //                 email: data.email,
    //     //                 isAdmin: data.isAdmin
    //     //             };
    //     //         });
    //     //         setItems(itemsList);
    //     //     } catch (error) {
    //     //         console.error('Error fetching data: ', error);
    //     //
    //     //     }
    //     // };
    //     //
    //     // fetchData()
    // }, [])

    // return isAuth ? (
    //     status ? (
    //         <div className={'main_container'}>
    //             <NavBar />
    //             <div className={'workspace'}>
    //                 <Header />
    //             </div>
    //         </div>
    //     )
    // ) : (
    //     <>
    //         <Navigate to='/signin' />
    //     </>
    // )
    return <>
        {status === 'loading' && <h1 className={'loading'}>Загрузка...</h1>}
        {status === 'succeeded' &&
            <div className={'main_container'}>
                <NavBar />
                <div className={'workspace'}>
                    <Header />
                </div>

            </div>
        }
        {status === 'failed' && <Navigate to={'/signin'} />}
    </>
};

export default MainPage;