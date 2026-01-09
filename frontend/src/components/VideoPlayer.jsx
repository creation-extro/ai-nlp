import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ src, onTimeUpdate }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        // Only initialize once
        if (!playerRef.current) {
            const videoElement = document.createElement('video-js');
            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, {
                autoplay: false,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [{ src, type: 'video/mp4' }]
            }, () => {
                console.log('Video.js Player is ready');
            });

            // Handle time updates
            player.on('timeupdate', () => {
                const currentTime = Math.floor(player.currentTime());
                onTimeUpdate(currentTime, player);
            });
        } else {
            // If src changes, just update the player source instead of re-initializing
            const player = playerRef.current;
            player.src({ src, type: 'video/mp4' });
        }
    }, [src, videoRef]);

    // Dispose player on unmount
    useEffect(() => {
        const player = playerRef.current;
        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div className="w-full" ref={videoRef} />
    );
};

export default VideoPlayer;