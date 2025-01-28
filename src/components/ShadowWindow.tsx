import React, { FC } from 'react';

interface ShadowWindowProps {
    text: string;
    onClose: () => void;
    deleteFunc: () => void;
    status: string | null
}

const ShadowWindow: FC<ShadowWindowProps> = ({text, onClose, deleteFunc, status }) => {

    return (
        <>
            <div className="overlay" onClick={onClose} />
            <div className={'shadow_window_container'}>
                Вы уверены, что хотите удалить {text}?
                <div className={'buttons_container'}>
                    <button
                        className={'error_button'}
                        onClick={deleteFunc}
                    >
                        {status === 'loading' ? 'Удаление...' : 'Удалить'}
                    </button>
                    <button
                        className={'default_button'}
                        onClick={onClose}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </>
    );
};

export default ShadowWindow;
