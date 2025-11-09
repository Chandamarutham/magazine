import styles from './AlbumsList.module.css';
import { PhotoAlbum } from './PhotoData';


function buildDriveUrl(locn, id) {
    // Using S3 bucket with CloudFront CDN
    return `https://d3hsmwayyrfuvx.cloudfront.net/Photos/${locn}/${id}`;
}

export default function AlbumsList({ setActiveAlbum }) {
    return (
        <>
            <h2 className={styles.title}>Albums</h2>
            <div className={styles.albumsGrid}>
                <ul>
                    {PhotoAlbum.map((album, index) => (
                        <li key={index} className={styles.albumItem}>
                            <button onClick={() => setActiveAlbum(album)} className={styles.albumButton}>
                                <img src={buildDriveUrl(album.folder, album.thumbnail)} alt={album.event} className={styles.albumThumbnail} />
                                <p className={styles.albumTitle}>{album.event}</p>
                                <p className={styles.albumDate}>{new Date(album.date).toLocaleDateString()}</p>
                                <p className={styles.albumPlace}>{album.place}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
