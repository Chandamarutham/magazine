import styles from '../styles/MainPanel.module.css';
import bannerImage from '/images/Thirumann.png';

export default function MainPanel() {
    return (
        <div className={styles.mainPanel}>
            <p className={`${styles.preamble} font-mukta`}>ஶ்ரீ:</p>
            <p className={`${styles.preamble} font-mukta`}>ஶ்ரீமதே ராமாநுஜாய நம: ■ ஶ்ரீஸ்ரீநிவாஸ மஹாகுரவே நம:</p>
            <img src={bannerImage} className={styles.thirumannImage} alt="திருமண்காப்பு" /> 
        </div>
    );
}
