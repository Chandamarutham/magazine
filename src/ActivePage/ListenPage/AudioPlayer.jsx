import { useMemo, useState } from 'react';
import styles from './AudioPlayer.module.css';
import AudioPlayerHeader from './AudioPlayerHeader';
import AudioTrack from './AudioTrack';

export default function AudioPlayer({ selected, setSelected }) {
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    // MP3 & M4A files data
    const audioFiles = useMemo(() => selected?.articles ?? [], [selected]);
    const audioTitle = useMemo(() => selected?.issueTitle || 'Selected Issue', [selected]);
    const audioFolder = useMemo(() => selected?.issueFolder || '', [selected]);

    return (
        <div className={styles.listenPageContainer}>
            <AudioPlayerHeader
                issueTitle={audioTitle}
                onBack={() => setSelected(null)}
            />

            <div className={styles.audioList}>
                {audioFiles.map((audioFile) => (
                    <AudioTrack
                        key={audioFile.id}
                        location={audioFolder}
                        audioFile={audioFile}
                        currentPlayingId={currentPlayingId}
                        setCurrentPlayingId={setCurrentPlayingId}
                    />
                ))}
            </div>
        </div>
    );
};