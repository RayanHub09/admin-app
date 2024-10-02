import React, {FC, useState} from 'react';
import {fetchPushNewMessage} from "../../store/slices/messages";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
interface InputMessageProps {
    uid: string
    chat_id: string
}
const InputMessage:FC<InputMessageProps> = ({uid, chat_id}) => {
    const [message, setMessage] = useState('')
    const [img, setImg] = useState('')
    const mid = useAppSelector(state => state.manager.manager.id)
    const dispatch = useAppDispatch()
    function sendMessage() {
        if (mid) {
            dispatch(fetchPushNewMessage({chat_id, mid, text:message}))
            setMessage('')

        }
    }

    return (
        <div className={'send_messages_container'}>
                <input
                    type="file"
                    style={{display: "none"}}
                    value={img}
                    onChange={event => setImg(event.target.value)}
                    id="file" />
                <label htmlFor="file" className={'custom-input-file'}>
                    {img ? <span className={"file-name"}>{img}</span> : <span className={'chose_file'}>Выбрать файл</span>}
                </label>
            <input
                value={message}
                onChange={event => setMessage(event.target.value)}
                placeholder={'Напишите сообщение...'}
                className={'send_messages'}/>
            <button
                onClick={sendMessage}
                disabled={message === '' && img === ''}
                className={'button_send_messages'}
            >Отправить</button>
        </div>
    );
};

export default InputMessage;