import styles from '../styles/StatusChip.module.css';
import { useState } from 'react';

export enum StatusChipType {
    ERROR = 'error',
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
}

const StatusChip = ({ message, type }: { message: string, type: StatusChipType}) => {
    return (
        <div className={`${styles.statusChip} ${styles[type]}`}>
            {message}
        </div>
    )
}

export default StatusChip;