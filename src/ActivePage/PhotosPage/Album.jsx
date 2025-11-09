import styles from './Album.module.css'
import AlbumHeader from './AlbumHeader';


function buildDriveUrl(locn, id) {
    // Using S3 bucket with CloudFront CDN
    return `https://d3hsmwayyrfuvx.cloudfront.net/Photos/${locn}/${id}`;
}
export default function Album({ activeAlbum, setActiveAlbum }) {

    return (
        <div>
            {/* Header */}
            <AlbumHeader activeAlbum={activeAlbum} setActiveAlbum={setActiveAlbum} />
            {/* Photos grid */}
            {activeAlbum ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {activeAlbum.photos?.map((p) => {
                        const src = buildDriveUrl(activeAlbum.folder, p.id)
                        return (
                            <figure key={p.photo_num ?? p.id} className="bg-white rounded-lg overflow-hidden shadow-sm ring-1 ring-black/5">
                                <div className={`${styles.imageWrap} bg-gray-100`}>
                                   <img
                                        className={`${styles.image}`}
                                        src={src}
                                        alt={p.caption || `Photo ${p.photo_num}`}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <figcaption className={`${styles.caption} px-3 py-2 text-sm text-gray-800 text-center`}>{p.caption}</figcaption>
                            </figure>
                        )
                    })}
                </div>
            ) : (
                <div className="text-gray-600">No albums available.</div>
            )}
        </div>
    )
}
