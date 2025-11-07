import styles from "./AudioIssuesList.module.css";
import { audioFiles } from "./AudioData";

export default function AudioIssuesList({ setSelected }) {
    return (
        <div className={styles.listContainer}>
            <h2 className={styles.heading}>Listen to Past Issues</h2>
            <ul className={styles.list}>
                {audioFiles.map((a, index) => (
                    <li key={a.issueTitle} className={styles.listItem}>
                        <button
                            className={styles.openButton}
                            onClick={() => setSelected(a)}
                            aria-label={`Open ${a.issueTitle}`}
                        >
                            <span className={styles.serialNumber}>{index + 1}. </span>
                            <span className={styles.issueTitle}>{a.issueTitle}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}