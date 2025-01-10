import React, {FC, useState} from 'react';
import 'figma-icons';

import {
    fetchPushNewMessage,
    setTemporaryMessage
} from "../../store/slices/messages";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
interface InputMessageProps {
    uid: string
    chat_id: string
}
const sendImage = require('../../image/send.png');
const addImage = require('../../image/files.png')
const InputMessage:FC<InputMessageProps> = ({uid, chat_id}) => {
    const [message, setMessage] = useState('')
    const [img, setImg] = useState('')
    const mid = useAppSelector(state => state.manager.manager.id)
    const dispatch = useAppDispatch()
    function sendMessage() {
        if (mid) {
            const fileInput = document.getElementById("file") as HTMLInputElement
            if (fileInput.files !== null) {
                const file = fileInput.files[0]
                dispatch(setTemporaryMessage(message))
                dispatch(fetchPushNewMessage({chat_id, mid, text:message, img: file ? file : null}))
                setMessage('')
                setImg('')

            }

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
                <label htmlFor="file" className={'custom-input-file'} style={!img ? {width: '40px', padding: '4px 1px'} : {width: 'auto', padding: '10px'}}>
                    {img ? <span className={"file-name"}>{img}</span> : <span className={'chose_file'}>
                        <img
                            title={'Выбрать файл'}
                            style={{width: '23px', paddingTop: '5px'}}
                            src={addImage}/>
                    </span>}
                </label>
            <input
                value={message}
                onChange={event => setMessage(event.target.value)}
                placeholder={'Напишите сообщение...'}
                className={'send_messages'}/>
            {message &&
                <button
                    onClick={sendMessage}
                    disabled={message === '' && img === ''}
                    className={'button_send_messages'}
                ><img
                    title={'Отправить'}
                    src={sendImage}
                    style={{width: '20px'}}
                    alt={''}/></button>
            }

        </div>
    );
};

export default InputMessage;