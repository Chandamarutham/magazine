import styles from '../styles/HomeStack.module.css';
import Akkarakkani from '/images/Akkarakkani.jpg';


export default function HomeStack() {
    return (
        <div className={styles.container}>
            <div className={styles.leftSpan}>
                <img src={Akkarakkani} className={styles.logo} alt="அக்காரக்கனி" />
            </div>
            <div className={styles.rightSpan}>
                <div className={styles.textContent}>
                    <p className={styles.description}>
                        <b>சண்டமாருதம்</b> என்பது ஶ்ரீவைஷ்ணவ சம்பிரதாய விஷயங்களை பகிர்வதற்காக உருவாக்கப்பட்ட ஒரு தமிழ்ப் பத்திரிகை. எங்கள் நோக்கம் தேர்ந்த ஞானம் கொண்ட வித்வான்களிடம் இருந்து கதை-கவிதை-கட்டுரைகள் பெற்று, அதை எல்லா மக்களுக்கும் உபயோகமாகும் வகையில் பதிவிடுவது.
                        <br /><br />
                        இந்த பத்திரிகை மூன்று மாதங்களுக்கு ஒரு முறை வெளியிடப்படும் மற்றும் இலவசமாக கிடைக்கும். எங்கள் பத்திரிகையின் மூலம், ஶ்ரீவைஷ்ணவ சமயத்தின் அழகையும், அதன் தத்துவங்களையும், அதன் பண்புகளையும் அனைவருக்கும் அறிமுகப்படுத்த விரும்புகிறோம்.
                    </p>
                </div>
            </div>
        </div>
    );
}