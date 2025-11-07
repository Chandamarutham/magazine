import styles from './AlbumHeader.module.css';


export default function AlbumHeader({ activeAlbum, setActiveAlbum }) {
    return (
        <div className={styles.albumHeader}>
            <button className={styles.backButton} onClick={() => setActiveAlbum(null)}>
                &larr; Back
            </button>
            <span className={styles.albumInformation}>
                {activeAlbum &&
                    (
                        <>
                            <h3 className={styles.albumTitle}>{activeAlbum.event}</h3>
                            <p className={styles.albumMeta}>
                                {activeAlbum.date ? `${new Date(activeAlbum.date).toLocaleDateString()}` : ''}
                                <br />
                                {activeAlbum.place ? `${activeAlbum.place}` : ''}
                            </p>
                            <p className={styles.albumDescription}>
                                {activeAlbum.description}
                            </p>
                        </>
                    )
                }
            </span>
        </div>
    );
}
