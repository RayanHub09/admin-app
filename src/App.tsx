import React from 'react';
import './App.sass';
import Router from "./components/Router";
import {useAuth} from "./hooks/use-auth";
import {useNavigate} from "react-router-dom";

function App() {
  return (
      <Router />
  )
}

export default App;
