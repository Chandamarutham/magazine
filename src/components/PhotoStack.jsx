import styles from '../styles/PhotoStack.module.css';

export default function PhotoStack() {
    // Default placeholder photos if none provided
    const acharyas = [
        './images/Dasarathy.jpg',
        './images/Doddaiyachar.jpg',
        './images/Periyappangar.jpg',
        './images/Singrachar.jpg',
        './images/Yoganrsimhan.jpg'
    ]
    return (
                <div className={styles.photoStack}>
                    {acharyas.map((photo, index) => (
                        <div 
                            key={index} 
                            className={styles.photo}
                        >
                            <img 
                                src={photo} 
                                alt={`Photo ${index + 1}`}
                                className={styles.photoImage}
                            />
                        </div>
                    ))}
                </div>
    );
}