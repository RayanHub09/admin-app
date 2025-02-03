import React, { FC } from 'react';
import CreateChatForm from "./messages/CreateChatForm";
import CreateOrder from "./orders/CreateOrder";

interface ShadowWindowProps {
    text: string
    create?: boolean
    onClose: () => void
    deleteFunc?: () => void
    status?: string | null
    uid?: string
}

const ShadowWindow: FC<ShadowWindowProps> = ({ text, onClose, deleteFunc,uid, create,  status }) => {

    return (

        <>
            <div className="overlay"  />
            <div className="shadow_window_container">
                {create === undefined ? <p>{text}</p> :
                    (
                        (text === 'Создание чата' && <CreateChatForm uid={uid as string} /> ) ||
                        (text === 'Создание заказа' && <CreateOrder />)

                    )
                }
                <div className="buttons_container">
                    {deleteFunc && (
                        <button
                            className="error_button"
                            onClick={deleteFunc}
                        >
                            {status === 'loading' ? 'Удаление...' : 'Удалить'}
                        </button>
                    )}
                    <button
                        className="default_button"
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
