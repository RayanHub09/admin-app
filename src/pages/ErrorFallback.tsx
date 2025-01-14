import React from 'react';

const ErrorFallback: React.FC = () => {
    return (
        <div>
            <h1>Произошла ошибка</h1>
            <p>Пожалуйста, попробуйте позже или вернитесь на главную страницу.</p>
        </div>
    );
};

export default ErrorFallback;
