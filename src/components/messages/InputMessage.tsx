import React, {FC, useState, useEffect, useRef} from 'react';
import 'figma-icons';
import {fetchPushNewMessage, setTemporaryMessage} from "../../store/slices/messages";
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
    const manager = useAppSelector(state => state.manager.manager)
    const [message, setMessage] = useState('Добрый день, \n' +
        '\n' +
        `С уважением, ${manager.name}, ${(manager.role === 'admin' && 'Managing Director') ||
        (manager.role === 'yahoo_auctions' && 'Yahoo Department Manager') ||
        (manager.role === 'spare_parts' && 'Parts Department Manager') ||
        (manager.role === 'parcels' && 'Parcels Department Manager') ||
        (manager.role === 'accounting' && 'Accounting Department Manager')}.`);
    const [files, setFiles] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const mid = useAppSelector(state => state.manager.manager.id);
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);
    const [messageCount, setMessageCount] = useState(0);
    const [lastSentTime, setLastSentTime] = useState<number | null>(null);

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

    // const formatTextForFirebase = (text: string) => {
    //     return text.replace(/\n/g, '<br />');
    // };

    const sendMessage = () => {
        console.log(message)
        if (mid) {
            if (message.length > MAX_MESSAGE_LENGTH) {
                setErrorMessage("Превышен лимит знаков, пожалуйста, разделите ваше сообщение на два");
                setTimeout(() => setErrorMessage(null), 2000);
                return;
            }
            dispatch(fetchPushNewMessage({chat_id, mid, text: message, files}));
            dispatch(setTemporaryMessage({
                text: message,
                files: files.length !== 0
            }));

            setMessage('');
            onSendMessage(message);
            setFiles([]);
            setErrorMessage(null);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
        if (files.length + selectedFiles.length > MAX_FILES_COUNT) {
            setErrorMessage(`Вы можете прикрепить не более ${MAX_FILES_COUNT} файлов за раз`);
            setTimeout(() => setErrorMessage(null), 2000);
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
                <label htmlFor="file" className={'custom-input-file'} style={{alignSelf: 'flex-start'}}>
                    <img title={'Выбрать файл'} style={{width: '26px', height: '26px', padding: '7px'}} src={addImage}/>
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={3}
                    className={'send_messages'}
                    placeholder="Введите ваше сообщение..."
                />
                {(message || files.length !== 0) && (
                    <button
                        onClick={sendMessage}
                        disabled={message === '' && files.length === 0}
                        className={'button_send_messages'}
                    >
                        <img
                            title={'Отправить'}
                            src={sendImage}
                            style={{width: '20px'}}
                            alt={''}
                        />
                    </button>
                )}
            </div>
            {files.length !== 0 && (
                <div
                    ref={inputRef}
                    className={'files_container'}>
                    {files.map((file, index) => (
                        <div key={index} className={'file'}>
                            <p>{file.name}</p>
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
