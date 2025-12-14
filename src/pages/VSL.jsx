import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, CheckCircle, Star, Lock, VolumeX } from 'lucide-react';

const VSL = () => {
    // Lead capture removed as per request
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    const handleInteraction = () => {
        if (!isAudioEnabled) return;

        setShowControls(true);

        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    const handleEnableAudio = () => {
        if (videoRef.current) {
            // Send command to unMute and restart/play
            const iframe = videoRef.current;
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');

            setIsAudioEnabled(true);
            setIsPlaying(true);
            setShowControls(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            const iframe = videoRef.current;
            if (isPlaying) {
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
                setShowControls(true);
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            } else {
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
                setShowControls(false);
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Simplified progress simulation for YouTube embed without full API
    // (Real progress sync requires the bulky YT API library)
    useEffect(() => {
        let interval;
        if (isPlaying && isAudioEnabled) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 0.1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isAudioEnabled]);

    return (
        <div className="container" style={{ padding: '40px 16px', background: '#FAFAFA' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Headline */}
                <h1 className="text-center" style={{
                    color: '#1F2937',
                    marginBottom: '40px',
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    lineHeight: '1.3'
                }}>
                    “A Verdade Sobre Recuperar o Corpo no Pós-Parto — e o Método Simples Que Transformou Milhares de Mães em 30 Dias.”
                </h1>

                {/* VSL Video */}
                <div
                    onClick={() => {
                        if (!isAudioEnabled) {
                            handleEnableAudio();
                        } else {
                            togglePlay();
                        }
                    }}
                    onMouseMove={handleInteraction}
                    onMouseLeave={() => isPlaying && setShowControls(false)}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        marginBottom: '40px',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        background: '#000',
                        position: 'relative',
                        cursor: 'pointer'
                    }}>
                    {/* Interaction Layer for Overlay Clicks */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 5,
                            display: isAudioEnabled ? 'none' : 'block' // Only block while waiting to unmute
                        }}
                    ></div>
                    <iframe
                        ref={videoRef}
                        src={`https://www.youtube.com/embed/xeTISviozS4?enablejsapi=1&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&loop=1&playlist=xeTISviozS4&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                        title="VSL Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            pointerEvents: 'none'
                        }}
                    ></iframe>

                    {/* Custom Controls (Only visible when audio is enabled and (paused or hovered)) */}
                    {isAudioEnabled && (showControls || !isPlaying) && (
                        <div
                            onClick={(e) => e.stopPropagation()} // Prevent triggering the video container click
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                padding: '20px 16px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                opacity: showControls ? 1 : 0,
                                transition: 'opacity 0.3s',
                                pointerEvents: showControls ? 'auto' : 'none'
                            }}
                        >
                            <button
                                onClick={togglePlay}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                            </button>

                            {/* Progress Bar Container */}
                            <div style={{
                                flex: 1,
                                height: '6px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '3px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Progress Fill */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    width: `${progress}%`,
                                    background: 'var(--color-primary)',
                                    borderRadius: '3px',
                                    transition: 'width 0.1s linear'
                                }} />
                            </div>
                        </div>
                    )}

                    {/* Unmute Overlay */}
                    {!isAudioEnabled && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                        }}>
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.95)', // Red color similar to screenshot
                                padding: '24px 32px',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(4px)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                transition: 'transform 0.2s',
                                animation: 'pulse 2s infinite'
                            }} className="hover-scale">
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Seu vídeo já começou
                                </span>

                                <VolumeX size={48} color="white" strokeWidth={1.5} />

                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    Clique para ouvir
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sales Letter Content */}
                <div className="card" style={{ marginBottom: '60px', padding: '40px 32px', border: 'none', background: 'white' }}>
                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#374151' }}>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>1. Abertura emocional</h3>
                            <p>“Mãe… eu sei como o pós-parto mexe com o corpo, com a rotina e até com a nossa identidade.
                                E sei também como é difícil tentar se cuidar enquanto cuida de um bebê.”</p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>2. Validação</h3>
                            <p>“Mas deixa eu te dizer uma coisa muito importante:
                                não é culpa sua.
                                Você só não tinha o método certo.”</p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>3. Quebra de crença</h3>
                            <p>“A maioria das mães tenta dieta restrita ou treinos pesados — exatamente o que NÃO funciona no pós-parto.”</p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>4. O Mecanismo REMAE</h3>
                            <p>“O Método REMAE foi criado para devolver às mães o que foi perdido:</p>
                            <ul style={{ listStyle: 'none', paddingLeft: '0', margin: '16px 0', display: 'grid', gap: '8px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} color="var(--color-primary)" /> força</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} color="var(--color-primary)" /> leveza</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} color="var(--color-primary)" /> organização</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} color="var(--color-primary)" /> autoestima</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} color="var(--color-primary)" /> confiança</li>
                            </ul>
                            <p>Em apenas 10–15 minutos por dia.”</p>
                        </div>

                        <div>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>5. Conexão com o Quiz</h3>
                            <p>“Pelas suas respostas, eu sei exatamente o que está travando você — e sei exatamente o que vai destravar.”</p>
                        </div>

                    </div>
                </div>

                {/* Offers Section */}
                <div id="offers" style={{ scrollMarginTop: '40px' }}>
                    <h2 className="text-center" style={{ marginBottom: '40px', fontSize: '2rem' }}>Escolha seu Plano de Transformação</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>

                        {/* Essential Package */}
                        <div className="card" style={{ border: '1px solid #E5E7EB', padding: 'clamp(20px, 4vw, 32px)', position: 'relative' }}>
                            <h3 className="text-center" style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#4B5563' }}>🔥 PACOTE ESSENCIAL</h3>
                            <div className="text-center" style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '1.5rem', color: '#9CA3AF', textDecoration: 'line-through', marginRight: '8px' }}>R$ 47,00</span>
                                <span style={{ fontSize: 'clamp(2.5rem, 5vw, 3rem)', fontWeight: '700', color: '#1F2937' }}>R$ 10</span>
                            </div>

                            <ul style={{ listStyle: 'none', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> E-book Transformação Pós-Parto</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> Planner de Rotina simples</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> Acesso vitalício</li>
                            </ul>

                            <button onClick={() => window.location.href = 'https://www.elyondigital.com.br/checkout/73b4a49b-a89e-45e6-9f46-65be9fee24dd'} className="btn btn-large" style={{ width: '100%', background: '#9CA3AF', boxShadow: 'none' }}>
                                Quero o Essencial
                            </button>
                        </div>

                        {/* Complete Package */}
                        <div className="card card-highlight" style={{
                            border: '2px solid var(--color-primary)',
                            padding: 'clamp(20px, 4vw, 32px)',
                            boxShadow: '0 20px 40px rgba(251, 124, 128, 0.15)',
                            position: 'relative',
                            zIndex: 10
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                padding: '8px 24px',
                                borderRadius: '30px',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                boxShadow: '0 4px 10px rgba(251, 124, 128, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                whiteSpace: 'nowrap'
                            }}>
                                <Star size={16} fill="white" /> MAIS VENDIDO
                            </div>

                            <h3 className="text-center" style={{ marginBottom: '16px', marginTop: '16px', fontSize: '1.5rem', color: 'var(--color-primary)' }}>🌟 PACOTE COMPLETO</h3>
                            <div className="text-center" style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '1.5rem', color: '#9CA3AF', textDecoration: 'line-through', marginRight: '8px' }}>R$ 97,00</span>
                                <span style={{ fontSize: 'clamp(3rem, 6vw, 3.5rem)', fontWeight: '800', color: 'var(--color-primary)' }}>R$ 27</span>
                            </div>

                            <ul style={{ listStyle: 'none', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', gap: '10px', fontWeight: '600' }}><CheckCircle size={20} color="var(--color-primary)" /> Tudo do Essencial +</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> 50 Receitas rápidas</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> Guia de Exercícios Seguros</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> Código do Conforto (sono + cólicas)</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> Mindset do Emagrecimento</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> Grupo Exclusivo de apoio</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--color-primary)" /> Acesso vitalício</li>
                            </ul>

                            <button onClick={() => window.location.href = 'https://www.elyondigital.com.br/checkout/73b4a49b-a89e-45e6-9f46-65be9fee24dd'} className="btn btn-large" style={{ width: '100%', fontSize: '1.2rem', padding: '20px' }}>
                                Quero o Completo
                            </button>
                        </div>

                    </div>

                    <div className="text-center" style={{ marginTop: '60px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <p style={{ fontSize: '1.25rem', color: '#374151', fontStyle: 'italic', lineHeight: '1.6' }}>
                            “Você não precisa escolher entre você e o bebê.
                            <br />
                            Você merece se sentir viva, leve e confiante.
                            <br />
                            E isso começa HOJE.”
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VSL;
