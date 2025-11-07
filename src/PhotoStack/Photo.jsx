import styles from './Photo.module.css';

const Photo = ({ image, caption, caption2, position }) => {
    return (
        <div className={styles.photoContainer}>
            {
                position === 'left' &&
                caption &&
                <div className={styles.photoCaption}>
                    {caption}
                    {caption2 && <div className={styles.photoCaption2}>{caption2}</div>}
                </div>
            }
            <img src={image} alt={caption} className={styles.photoImage} />
            {
                position === 'right' &&
                caption &&
                <div className={styles.photoCaption}>
                    {caption}
                    {caption2 && <div className={styles.photoCaption2}>{caption2}</div>}
                </div>}
        </div>
    );
};

export default Photo;
