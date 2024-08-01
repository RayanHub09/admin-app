import React from 'react';

const Loading = () => {
    return (
        <div className={'loading_container'}>
            <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p>Загрузка...</p>
        </div>
    );
};

export default Loading;