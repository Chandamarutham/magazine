import React, { useState } from 'react'
import styles from '../styles/ReadMagazine.module.css'

// Replace these IDs with your real Google Drive file IDs.
const PDF_LIST = [
    { id: '1mN1NsEWKaEcopp8XbHpNh8m2vuIBp0gA', title: 'Magazine — October 2025' },
]

function previewUrl(driveId) {
    // Google Drive preview endpoint that's embeddable in an iframe
    return `https://drive.google.com/file/d/${driveId}/preview`
}

export default function ReadMagazine() {
    const [selected, setSelected] = useState(null)

    return (
        <div className={styles.container}>
            {!selected ? (
                <div>
                    <h2 className={styles.heading}>Available Magazines</h2>
                    <ul className={styles.list}>
                        {PDF_LIST.map((p) => (
                            <li key={p.id} className={styles.listItem}>
                                <button
                                    className={styles.openButton}
                                    onClick={() => setSelected(p)}
                                    aria-label={`Open ${p.title}`}
                                >
                                    {p.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className={styles.viewerWrap}>
                    <div className={styles.viewerHeader}>
                        <button className={styles.closeButton} onClick={() => setSelected(null)}>
                            ← Back to list
                        </button>
                        <div className={styles.viewerTitle}>{selected.title}</div>
                        <a
                            className={styles.external}
                            href={`https://drive.google.com/file/d/${selected.id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open in new tab
                        </a>
                    </div>

                    <div className={styles.iframeWrap}>
                        <iframe
                            title={selected.title}
                            src={previewUrl(selected.id)}
                            className={styles.iframe}
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
