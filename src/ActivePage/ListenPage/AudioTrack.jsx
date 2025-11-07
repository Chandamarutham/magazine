import styles from './AudioTrack.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect } from "react";


// Custom-tailored audio track with Tailwind-styled controls and
// single-track playback coordination via currentPlayingId.
// Props: { audioFile: { id, title, file }, currentPlayingId, setCurrentPlayingId }
export default function AudioTrack({ audioFile, currentPlayingId, setCurrentPlayingId }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const id = audioFile?.id;

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const onTime = () => setTime(el.currentTime || 0);
        const onLoaded = () => setDuration(el.duration || 0);
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentPlayingId?.(null);
        };
        const onError = () => {
            // Pause and reset minimal state on load/playback error
            try { el.pause(); } catch { /* no-op */ }
            setIsPlaying(false);
        };

        el.addEventListener("timeupdate", onTime);
        el.addEventListener("loadedmetadata", onLoaded);
        el.addEventListener("ended", onEnded);
        el.addEventListener("error", onError);
        return () => {
            el.removeEventListener("timeupdate", onTime);
            el.removeEventListener("loadedmetadata", onLoaded);
            el.removeEventListener("ended", onEnded);
            el.removeEventListener("error", onError);
        };
    }, [setCurrentPlayingId]);

    // Ensure metadata loads so duration is available before play
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        // Reset local state on source change
        setTime(0);
        setDuration(0);
        setIsPlaying(false);
        try {
            // Calling load() prompts the browser to fetch metadata when preload allows it
            el.load();
        } catch { /* no-op */ }
    }, [audioFile?.file]);

    // Pause this track if another one becomes current
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const isActive = currentPlayingId === id;
        if (!isActive && !el.paused) {
            el.pause();
            setIsPlaying(false);
        }
    }, [currentPlayingId, id]);

    const togglePlay = () => {
        const el = audioRef.current;
        if (!el) return;
        const isActive = currentPlayingId === id;

        // If clicking a different track, mark as current first
        if (!isActive) {
            setCurrentPlayingId?.(id);
            const playPromise = el.play();
            if (playPromise && typeof playPromise.then === "function") {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => {
                        setIsPlaying(false);
                    });
            } else {
                setIsPlaying(true);
            }
            return;
        }

        // If this is the active track, just toggle
        if (el.paused) {
            const playPromise = el.play();
            if (playPromise && typeof playPromise.then === "function") {
                playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
                setIsPlaying(true);
            }
        } else {
            el.pause();
            setIsPlaying(false);
            setCurrentPlayingId?.(null);
        }
    };

    const seek = (e) => {
        const el = audioRef.current;
        if (!el) return;
        const v = Number(e.target.value);
        if (!Number.isFinite(v)) return;
        el.currentTime = v;
        setTime(v);
    };

    const fmt = (t) => {
        if (!isFinite(t)) return "0:00";
        const m = Math.floor(t / 60) || 0;
        const s = Math.floor(t % 60) || 0;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div
            className={styles.trackContainer}
            onContextMenu={(e) => e.preventDefault()}
        >
            <p className={styles.trackTitle}>
                {audioFile?.title}
            </p>

            {/* Hidden/native audio element without controls */}
            <audio
                ref={audioRef}
                src={audioFile?.file || ""}
                preload="metadata"
                playsInline
                className="hidden"
            />

            <div className={styles.controlsContainer}>
                <button
                    type="button"
                    onClick={togglePlay}
                    className={styles.playPauseButton}
                    aria-label={isPlaying && currentPlayingId === id ? "Pause" : "Play"}
                >
                    {isPlaying && currentPlayingId === id ?
                        <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </button>

                <span className={styles.timeDisplay}>
                    {fmt(time)}
                </span>

                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(time, duration || 0)}
                    onChange={seek}
                    className={styles.seekSlider}
                />

                <span className={styles.durationDisplay}>
                    {fmt(duration)}
                </span>
            </div>
        </div>
    );
}