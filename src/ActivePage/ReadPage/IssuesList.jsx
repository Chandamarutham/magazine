import styles from "./IssuesList.module.css";
import { PdfList } from "./PdfList";

export default function IssuesList({ setSelected }) {
    return (
        <div className={styles.listContainer}>
            <h2 className={styles.heading}>Read Past Issues</h2>
            <ul className={styles.list}>
                {PdfList.map((p, index) => (
                    <li key={p.filename} className={styles.listItem}>
                        <button
                            className={styles.openButton}
                            onClick={() => setSelected(p)}
                            aria-label={`Open ${p.title}`}
                        >
                            <span className={styles.serialNumber}>{index + 1}. </span>
                            <span className={styles.issueTitle}>{p.title}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
