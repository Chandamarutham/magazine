import styles from '../styles/SidePanel.module.css';


export default function SidePanel({image='', caption=''}) {
    return (
        <span> 
            <div className={styles.sidePanelContainer}>
                <img src={image} className={styles.sidePanelImage} alt={caption} />
            </div>
            <p className={`${styles.acharyaName} font-mukta`}>{caption}</p>
        </span>
    );
}