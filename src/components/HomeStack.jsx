import styles from '../styles/HomeStack.module.css';
import PhotoStack from '../components/PhotoStack';
import Akkarakkani from '/images/Akkarakkani.jpg';
import HomeContent from '../components/HomeContent';

export default function HomeStack() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.leftSpan}>
                    <img src={Akkarakkani} className={styles.image} alt="அக்காரக்கனி" />
                </div>
                <div className={styles.rightSpan}>
                    <PhotoStack />
                </div>
            </div>
        </>
    );
}