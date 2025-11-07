import styles from './AudioPlayerHeader.module.css';

export default function AudioPlayerHeader({ issueTitle, onBack }) {
    return (
        <div className={styles.contentHeader}>
            <button className={styles.backButton} onClick={() => onBack()}>
                &larr; Back
            </button>
            <span className={styles.pageDescription}>
                {issueTitle || ''}
            </span>
        </div>
    );
}
