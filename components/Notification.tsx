import styles from '../styles/Notification.module.css';
import { useState } from 'react';

export enum NotificationType {
    ERROR = 'error',
    SUCCESS = 'success',
    INFO = 'info',
}

const Notification = ({ message, type }: { message: string, type: NotificationType }) => {
    const [isVisible, setIsVisible] = useState(true);
    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        
        <div className={`${styles.notification} ${styles[type]}`}>
            {message}
            <button className={styles.closeButton} onClick={handleClose}>X</button>
        </div>
    )
}

export default Notification;