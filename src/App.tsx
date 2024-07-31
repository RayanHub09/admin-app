import React, {createContext} from 'react';
import './App.sass';
import Router from "./components/router/Router";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import {useAppSelector} from "./hooks/redux-hooks";

interface AuthContextType {
    isAuth: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function App() {
    const isAuth = useAppSelector(state => state.worker.isAuth)

    return (
        <div className={'App'}>
            {isAuth && <Header/>}
            <Router />
        </div>
    )
}

export default App;
