import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { bgm } from '../utils/sounds';

const AudioController = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const location = useLocation();
    const isVSL = location.pathname === '/results' || location.pathname === '/vsl';

    useEffect(() => {
        if (isVSL) {
            bgm.stop();
            setIsPlaying(false);
            return;
        }

        // 1. Try to play immediately if not on VSL
        try {
            if (!bgm.playing()) {
                bgm.play();
                setIsPlaying(true);
            }
        } catch (e) {
            console.log("Autoplay blocked, waiting for interaction");
        }

        // 2. Global listener to unlock audio context on first user interaction
        const unlockAudio = () => {
            if (isVSL) return; // Don't start if on VSL

            if (!bgm.playing()) {
                bgm.play();
                setIsPlaying(true);
            }
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('keydown', unlockAudio);

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
    }, [location.pathname, isVSL]);

    useEffect(() => {
        const syncState = () => setIsPlaying(bgm.playing());

        bgm.on('play', syncState);
        bgm.on('pause', syncState);
        bgm.on('stop', syncState);

        return () => {
            bgm.off('play', syncState);
            bgm.off('pause', syncState);
            bgm.off('stop', syncState);
        };
    }, []);

    const toggleSound = (e) => {
        e.stopPropagation();
        if (isVSL) return;

        if (bgm.playing()) {
            bgm.pause();
        } else {
            bgm.play();
        }
    };

    // Hide controller on VSL page if desired, or just keep it as mute control
    if (isVSL) return null;

    return (
        <button
            onClick={toggleSound}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
            }}
            className="btn-audio"
            title={isPlaying ? "Silenciar" : "Ativar Som"}
        >
            {isPlaying ? <Volume2 size={24} color="#FB7C80" /> : <VolumeX size={24} color="#9CA3AF" />}
        </button>
    );
};



export default AudioController;
