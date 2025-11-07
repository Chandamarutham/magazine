import styles from './ReadPage.module.css';
import IssuesList from './IssuesList';
import ViewIssue from './ViewIssue';
import { useState } from 'react';


export default function ReadPage() {
    const [selected, setSelected] = useState(null)
    return (
        <div className={styles.viewerWrap}>
            {!selected ? (
                <IssuesList setSelected={setSelected} />
            ) : (
                <ViewIssue selected={selected} setSelected={setSelected} onClose={() => setSelected(null)} />
            )
        }
        </div>
    )
}
