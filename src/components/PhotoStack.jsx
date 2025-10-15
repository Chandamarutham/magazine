import styles from '../styles/PhotoStack.module.css';

export default function PhotoStack({ godPhoto = '', photos = [], className = '' }) {
    // Default placeholder photos if none provided
    const defaultPhotos = [
        'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Photo+1',
        'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Photo+2',
        'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Photo+3'
    ];

    const displayPhotos = photos.length >= 3 ? photos.slice(0, 3) : defaultPhotos;

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.leftSpan}>
                <img src={godPhoto} className={styles.logo} alt="அக்காரக்கனி" />

            </div>
            <div className={styles.rightSpan}>
                <div className={styles.photoStack}>
                    {displayPhotos.map((photo, index) => (
                        <div 
                            key={index} 
                            className={`${styles.photo} ${styles[`photo${index + 1}`]}`}
                        >
                            <img 
                                src={photo} 
                                alt={`Photo ${index + 1}`}
                                className={styles.photoImage}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}