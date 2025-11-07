import { useState, useEffect } from 'react';
import styles from './PhotoStack.module.css';
import Photo from './Photo';
import { PhotoItems } from './PhotosData';

export default function PhotoStack() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!PhotoItems || PhotoItems.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % PhotoItems.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.inner}>
                    <Photo
                        image={PhotoItems[currentIndex].file}
                        caption={PhotoItems[currentIndex].caption}
                        caption2={PhotoItems[currentIndex].caption2}
                        position={currentIndex % 2 === 0 ? 'left' : 'right'}
                    />
                </div>
            </div>
        </>
    );
}