import { useMemo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './ViewIssue.module.css';
import ViewerHeader from './ViewerHeader';
import PdfFrame from './PdfFrame';

function getPdfUrlFromId(id) {
    return `https://drive.google.com/file/d/${id}/preview`;
}

export default function ViewIssue({ selected, setSelected }) {
    const articles = useMemo(() => selected?.articles || [], [selected]);
    const [expandedId, setExpandedId] = useState(null);

    const handleToggle = useCallback((id) => {
        // Toggle: clicking the expanded button should collapse it
        setExpandedId((prev) => (prev === id ? null : id));
    }, []);

    return (
        <div className={styles.viewIssueWrapper}>
            <ViewerHeader selected={selected} setSelected={setSelected} />
            {!articles.length && (
                <div className={styles.emptyState}>No articles available.</div>
            )}
            <div className={styles.articlesList}>
                {articles.map((article) => {
                    const isExpanded = expandedId === article.id;
                    const pdfUrl = isExpanded ? getPdfUrlFromId(article.id) : null;
                    return (
                        <div key={article.id} className={styles.articleBlock}>
                            <button
                                type="button"
                                className={isExpanded ? styles.articleButtonExpanded : styles.articleButton}
                                onClick={() => handleToggle(article.id)}
                            >
                                <FontAwesomeIcon
                                    icon={isExpanded ? faChevronDown : faChevronRight}
                                    className={styles.chevron}
                                />
                                <span className={styles.articleTitle}>{article.name}</span>
                            </button>
                            {isExpanded && (
                                <div className={styles.pdfFrameWrapper}>
                                    <PdfFrame pdfTitle={article.name} pdfUrl={pdfUrl} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
