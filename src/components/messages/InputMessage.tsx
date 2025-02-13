import React, {FC, useState, useEffect, useRef} from 'react';
import 'figma-icons';

import {
    fetchPushNewMessage
} from "../../store/slices/messages";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";

interface InputMessageProps {
    uid: string;
    chat_id: string;
    onSendMessage: (message: string) => void;
}

const sendImage = require('../../image/send.png');
const addImage = require('../../image/files.png');

const MAX_MESSAGE_LENGTH = 3000;
const MAX_FILE_SIZE_MB = 30;
const MAX_FILES_COUNT = 5;
const MESSAGE_LIMIT = 4;
const MESSAGE_INTERVAL_MS = 35000;

const InputMessage: FC<InputMessageProps> = ({uid, chat_id, onSendMessage}) => {
    const [message, setMessage] = useState('');
    const [img, setImg] = useState<File | null>(null);
    const [messageCount, setMessageCount] = useState(0);
    const [lastSentTime, setLastSentTime] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const mid = useAppSelector(state => state.manager.manager.id);
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (messageCount >= MESSAGE_LIMIT) {
            const timer = setTimeout(() => {
                setMessageCount(0);
            }, MESSAGE_INTERVAL_MS);
            return () => clearTimeout(timer);
        }
    }, [messageCount]);

    function sendMessage() {
        if (mid) {
            if (message.length > MAX_MESSAGE_LENGTH) {
                setErrorMessage("Превышен лимит знаков, пожалуйста, разделите ваше сообщение на два");
                setTimeout(() => setErrorMessage(null), 2000)
                return;
            }

            if (img && img.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setErrorMessage("Превышен максимальный размер файла 30 Мб");
                setTimeout(() => setErrorMessage(null), 2000)
                return;
            }

            if (messageCount >= MESSAGE_LIMIT) {
                if (lastSentTime === null || Date.now() - lastSentTime > MESSAGE_INTERVAL_MS) {
                    setMessageCount(messageCount + 1);
                    setLastSentTime(Date.now());
                } else {
                    setErrorMessage("Вы отправляете слишком много сообщений за короткий промежуток времени, пожалуйста, подождите")
                    setTimeout(() => setErrorMessage(null), 2000)
                    return;
                }
            } else {
                setMessageCount(prev => prev + 1);
            }
            dispatch(fetchPushNewMessage({ chat_id, mid, text: message, files }))
                .then(() => {
                    // Вызываем функцию обратного вызова
                    setMessage('');
                    onSendMessage(message);
                    setFiles([]);
                    setImg(null);
                    setErrorMessage(null);
                });
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
        if (files.length + selectedFiles.length > MAX_FILES_COUNT) {
            setErrorMessage(`Вы можете прикрепить не более ${MAX_FILES_COUNT} файлов за раз`)
            setTimeout(() => setErrorMessage(null), 2000)
            return;
        }
        setFiles([...files, ...selectedFiles]);
    };


    return (
        <div className={'container_send'}>
            {errorMessage && <p className="error_button">{errorMessage}</p>}
            <div className={'send_messages_container'}>
                <input
                    type="file"
                    style={{display: "none"}}
                    onChange={handleFileChange}
                    id="file"
                />
                {img &&
                    <button
                        className={'custom-input-file'}
                        style={!img ? {width: '40px', padding: '4px 1px'} : {width: 'auto', padding: '10px'}}
                    >Прикрепить
                    </button>
                }
                <label
                    htmlFor="file"
                    className={'custom-input-file'}>
                    <img
                        title={'Выбрать файл'}
                        style={{width: '26px', height: '26px', padding: '7px'}}
                        src={addImage}
                    />
                </label>
                <input
                    ref={inputRef}
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={'Напишите сообщение...'}
                    className={'send_messages'}
                />
                {(message || img) &&
                    <button
                        onClick={sendMessage}
                        disabled={message === '' && img === null}
                        className={'button_send_messages'}
                    >
                        <img
                            title={'Отправить'}
                            src={sendImage}
                            style={{width: '20px'}}
                            alt={''}
                        />
                    </button>
                }
            </div>
            {files && (
                <div className={'files_container'}>
                    {files.map((file, index) => (
                        <div key={index} className={'file'}>
                            <p >{file.name}</p>
                            <button
                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                title={'Удалить'}
                                className={'delete_file_button'}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InputMessage;
