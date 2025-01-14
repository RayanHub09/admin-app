import React, { useState, useEffect, createContext, useContext } from 'react';

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
