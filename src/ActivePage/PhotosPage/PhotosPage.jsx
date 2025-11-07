import { useState } from 'react'
import AlbumsList from './AlbumsList';
import Album from './Album';

export default function PhotosPage() {
    const [activeAlbum, setActiveAlbum] = useState(null);
    return (
        <>
            {!activeAlbum ? 
                (<AlbumsList setActiveAlbum={setActiveAlbum} />) 
                : 
                (<Album activeAlbum={activeAlbum} setActiveAlbum={setActiveAlbum} />)
            }
        </>
    );
}
