import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from "../pages/SignInPage";
import MainPage from "../pages/MainPage";


const Router = () => {
    return (
        <Routes>
            <Route path={'/'} element={<MainPage/>}/>
            <Route path={'/signin'} element={<SignInPage/>} />
        </Routes>
    );
};

export default Router;