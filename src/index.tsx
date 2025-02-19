import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store";
import './firebase'
// import ErrorBoundary from "./ErrorBoundary";
import ErrorFallback from "./pages/ErrorFallback";
import NetworkStatus from "./pages/NetworkStatus";
import { useState, useEffect, createContext, useContext } from 'react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

interface ErrorBoundaryContextType {
    hasError: boolean;
    setHasError: (value: boolean) => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | undefined>(undefined);

export const useErrorBoundary = () => {
    const context = useContext(ErrorBoundaryContext);
    if (!context) {
        throw new Error("useErrorBoundary must be used within an ErrorBoundaryProvider");
    }
    return context;
};

const ErrorBoundaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    return (
        <ErrorBoundaryContext.Provider value={{ hasError, setHasError }}>
            {children}
        </ErrorBoundaryContext.Provider>
    );
};

interface Props {
    children: React.ReactNode;
    FallbackComponent: React.ComponentType;
}

const ErrorBoundary: React.FC<Props> = ({ children, FallbackComponent }) => {
    const { hasError, setHasError } = useErrorBoundary();

    useEffect(() => {
        const handleError = (error: Error) => {
            console.error("Ошибка поймана в ErrorBoundary:", error);
            setHasError(true);
        };

        window.addEventListener('error', (event) => handleError(event.error as Error));
        return () => {
            window.removeEventListener('error', (event) => handleError(event.error as Error));
        };
    }, [setHasError]);

    if (hasError) {
        return <FallbackComponent />;
    }

    return <>{children}</>;
};

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ErrorBoundaryProvider>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <NetworkStatus />
                        <App/>
                    </ErrorBoundary>
                </ErrorBoundaryProvider>

            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

