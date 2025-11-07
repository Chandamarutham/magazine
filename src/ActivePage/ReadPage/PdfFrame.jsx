import styles from "./PdfFrame.module.css";

export default function PdfFrame({ pdfTitle, pdfUrl }) {
    if (!pdfUrl) return null;
    return (
        <div className={styles.iframeWrap}>
            <iframe
                title={pdfTitle || "PDF Viewer"}
                src={pdfUrl}
                className={styles.iframe}
                allowFullScreen
            />
        </div>
    );
}