import styles from './ViewerHeader.module.css';


export default function ViewerHeader({ selected, setSelected }) {
    return (
        <div className={styles.viewerHeader}>
            <button className={styles.buttonControl} onClick={() => setSelected(null)}>
                &larr; Back
            </button>
            <div className={styles.viewerTitle}>{selected.title}</div>
        </div>
    );
}
