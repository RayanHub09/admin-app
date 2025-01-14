import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NetworkStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const navigate = useNavigate();

    useEffect(() => {
        const updateOnlineStatus = () => {
            const online = navigator.onLine;
            setIsOnline(online);
            if (online) {
                // Если подключение восстановлено, перенаправляем на главную страницу или другую
                navigate('/orders');
            } else {
                // Если интернет отключен, перенаправляем на страницу offline
                navigate('/offline');
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Очистка обработчиков при размонтировании компонента
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, [navigate]);

    return null;
};

export default NetworkStatus;