import styles from "./ListenPage.module.css";
import AudioIssuesList from "./AudioIssuesList";
import AudioPlayer from "./AudioPlayer";
import { useState } from 'react';


export default function ListenPage() {
    const [selected, setSelected] = useState(null);
    return (
        <div className={styles.ListenerrWrap}>
            {!selected ? (
                <AudioIssuesList setSelected={setSelected} />
            ) : (
                <AudioPlayer selected={selected} setSelected={setSelected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}
