import React, { useEffect, useState, useRef } from 'react';
import { Check, Star, ShieldCheck, Play, Pause, VolumeX } from 'lucide-react';
import { bgm } from '../utils/sounds';

const Results = () => {
    const videoRef = useRef(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(false);

    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        bgm.stop();
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
            const iframe = videoRef.current;
            iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');

            setIsAudioEnabled(true);
            setIsPlaying(true);
            setShowControls(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            const iframe = videoRef.current;
            if (isPlaying) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                setShowControls(true);
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            } else {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                setShowControls(false);
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        let interval;
        if (isPlaying && isAudioEnabled) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 0.1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isAudioEnabled]);

    const handleCheckout = () => {
        window.location.href = 'https://www.elyondigital.com.br/checkout/73b4a49b-a89e-45e6-9f46-65be9fee24dd';
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 16px', background: 'linear-gradient(180deg, #FFF 0%, #FFF5F5 100%)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                {/* Título Principal */}
                <h1 className="text-center" style={{
                    color: '#1F2937',
                    marginBottom: '32px',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    lineHeight: '1.2',
                    fontWeight: '800'
                }}>
                    <span style={{ color: '#FB7C80' }}>A Verdade Sobre Recuperar o Corpo</span> no Pós-Parto — e o <span style={{ color: '#FB7C80' }}>Método Simples</span> Que Transformou Milhares de Mães em 30 Dias.
                </h1>

                {/* Video Placeholder */}
                {/* Video VSL */}
                {/* Video VSL */}
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
                        position: 'relative',
                        paddingBottom: '56.25%',
                        marginBottom: '40px',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        background: '#000',
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
                            display: isAudioEnabled ? 'none' : 'block'
                        }}
                    ></div>

                    <iframe
                        ref={videoRef}
                        src="https://www.youtube.com/embed/xeTISviozS4?enablejsapi=1&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&loop=1&playlist=xeTISviozS4"
                        title="VSL Video"
                        loading="eager"
                        fetchpriority="high"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: isAudioEnabled ? 'auto' : 'none'
                        }}
                    ></iframe>

                    {/* Custom Controls */}
                    {isAudioEnabled && (showControls || !isPlaying) && (
                        <div
                            onClick={(e) => e.stopPropagation()}
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

                            <div style={{
                                flex: 1,
                                height: '6px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '3px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    width: `${progress}%`,
                                    background: '#FB7C80',
                                    borderRadius: '3px',
                                    transition: 'width 0.1s linear'
                                }} />
                            </div>
                        </div>
                    )}

                    {/* Overlay */}
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
                                background: 'rgba(239, 68, 68, 0.95)',
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

                <div className="card card-futuristic" style={{ padding: '32px', marginBottom: '40px' }}>

                    {/* 1. Abertura Emocional */}
                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4B5563', marginBottom: '16px' }}>
                            Mãe… eu sei como o pós-parto mexe com o corpo, com a rotina e até com a nossa identidade.
                            E sei também como é difícil tentar se cuidar enquanto cuida de um bebê.
                        </p>
                    </div>

                    {/* 2. Validação */}
                    <div style={{ marginBottom: '32px', borderLeft: '4px solid #FB7C80', paddingLeft: '16px' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1F2937' }}>
                            Mas deixa eu te dizer uma coisa muito importante: <br />
                            <span style={{ color: '#FB7C80' }}>não é culpa sua.</span>
                        </p>
                        <p style={{ fontSize: '1.1rem', color: '#4B5563', marginTop: '8px' }}>
                            Você só não tinha o método certo.
                        </p>
                    </div>

                    {/* 3. Quebra de Crença */}
                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4B5563' }}>
                            A maioria das mães tenta dieta restrita ou treinos pesados — exatamente o que <strong>NÃO</strong> funciona no pós-parto.
                        </p>
                    </div>

                    {/* 4. O Mecanismo REMAE */}
                    <div style={{ marginBottom: '32px', background: '#FFF5F5', padding: '24px', borderRadius: '16px' }}>
                        <h3 style={{ color: '#FB7C80', marginBottom: '16px', fontSize: '1.3rem' }}>O Método RE-MÃE foi criado para devolver às mães o que foi perdido:</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Força', 'Leveza', 'Organização', 'Autoestima', 'Confiança'].map((item, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', fontSize: '1.1rem', color: '#374151' }}>
                                    <Check size={20} color="#10B981" style={{ marginRight: '12px' }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p style={{ marginTop: '16px', fontWeight: '600', color: '#FB7C80' }}>Em apenas 10–15 minutos por dia.</p>
                    </div>

                    {/* 5. Conexão com o Quiz */}
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4B5563' }}>
                            Pelas suas respostas, eu sei exatamente o que está travando você — e sei exatamente o que vai destravar.
                        </p>
                    </div>

                </div>

                {/* 6. OFERTA E PACOTES */}
                <h2 className="text-center" style={{ marginBottom: '32px', color: '#1F2937' }}>Escolha o Seu Plano de Transformação</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                    {/* PACOTE ESSENCIAL */}
                    <div className="card" style={{ padding: '32px', border: '1px solid #E5E7EB', position: 'relative' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '8px' }}>Pacote Essencial</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1F2937', marginBottom: '24px' }}>R$ 10,00</div>

                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#10B981" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>E-book Transformação Pós-Parto:</strong> passo a passo para recuperar seu corpo em 30 dias</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#10B981" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>Planner de Rotina:</strong> organização simples para refeições, água, sono e autocuidado</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#10B981" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>Acesso vitalício:</strong> ao conteúdo principal</span>
                            </li>
                        </ul>

                        <button onClick={handleCheckout} className="btn btn-large" style={{ width: '100%', background: '#9CA3AF', fontSize: '1.1rem' }}>
                            Quero o Essencial
                        </button>
                    </div>

                    {/* PACOTE COMPLETO */}
                    <div className="card" style={{ padding: '32px', border: '2px solid #FB7C80', position: 'relative', background: '#FFF5F5' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#FB7C80',
                            color: 'white',
                            padding: '4px 16px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            boxShadow: '0 4px 6px rgba(251, 124, 128, 0.3)'
                        }}>
                            MAIS VENDIDO
                        </div>

                        <h3 style={{ fontSize: '1.5rem', color: '#FB7C80', marginBottom: '8px' }}>Pacote Completo</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FB7C80', marginBottom: '24px' }}>R$ 27,00</div>

                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
                                <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span>Tudo do Pacote Essencial</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>50 Receitas Rápidas:</strong> refeições práticas, nutritivas e simples para mães ocupadas</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>Código do Conforto:</strong> técnicas para reduzir cólicas e melhorar o sono do bebê</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>Guia de Exercícios Seguros:</strong> treinos leves para recuperar força e reduzir flacidez</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>Mindset do Emagrecimento:</strong> como manter constância e autoestima no pós-parto</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>Grupo Exclusivo:</strong> apoio emocional, motivação e acompanhamento diário</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                <span><strong>Acesso Vitalício:</strong> a todos os materiais</span>
                            </li>
                        </ul>

                        <button onClick={handleCheckout} className="btn btn-large" style={{ width: '100%', fontSize: '1.1rem' }}>
                            Quero o Completo
                        </button>
                    </div>

                </div>

                {/* Fechamento Emocional */}
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', color: '#4B5563', marginBottom: '16px' }}>
                        Você não precisa escolher entre você e o bebê.
                    </p>
                    <p style={{ fontSize: '1.2rem', color: '#4B5563', marginBottom: '16px' }}>
                        Você merece se sentir viva, leve e confiante.
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FB7C80' }}>
                        E isso começa HOJE.
                    </p>

                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '16px', color: '#9CA3AF', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><ShieldCheck size={16} style={{ marginRight: '4px' }} /> Compra Segura</span>
                        <span style={{ display: 'flex', alignItems: 'center' }}><ShieldCheck size={16} style={{ marginRight: '4px' }} /> Satisfação Garantida</span>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default Results;
