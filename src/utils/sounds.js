import { Howl } from 'howler';

// Web Audio API Synthesizer for SFX (to avoid 403 errors from external assets)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

// --- Sound Effects (SFX) - Synthesized ---

const playTone = (freq, type, duration, vol = 0.1) => {
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
};

const playCoin = () => {
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};

const playSuccess = () => {
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
    });
};

export const sfx = {
    hover: { play: () => playTone(400, 'sine', 0.05, 0.02) },
    click: { play: () => playCoin() },
    success: { play: () => playSuccess() },
    flip: { play: () => playTone(300, 'triangle', 0.1, 0.05) },
    match: {
        play: () => {
            if (ctx.state === 'suspended') ctx.resume();
            playTone(880, 'sine', 0.2, 0.1);
            setTimeout(() => playTone(1108, 'sine', 0.3, 0.1), 150);
        }
    },
    achievement: { play: () => playSuccess() }
};

// --- Background Music (BGM) - Local File ---
// Using Howler for the music track as it handles large files/looping better
export const bgm = new Howl({
    src: ['/bgm.mp3'],
    loop: true,
    volume: 0.05,
    html5: true,
    preload: true
});

export const toggleBGM = (play) => {
    if (play) {
        if (!bgm.playing()) bgm.play();
        bgm.fade(0, 0.3, 1000);
    } else {
        bgm.fade(0.3, 0, 1000);
        setTimeout(() => bgm.pause(), 1000);
    }
};
