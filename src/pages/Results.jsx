import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, Play, Pause, VolumeX } from 'lucide-react';
import { bgm } from '../utils/sounds';

// ==========================================
// CONFIGURAÇÕES DA VSL (YOUTUBE - API MODE)
// ==========================================
const VSL_CONFIG = {
    // ID do vídeo do YouTube
    videoId: "xeTISviozS4",
    offerDelaySeconds: 0,
    primaryColor: '#FB7C80'
};

// ==========================================
// COMPONENT: YOUTUBE PLAYER NATIVE (CONTROLS=1, NO BORDERS)
// ==========================================
const VSLPlayer = ({ onProgress }) => {
    const playerRef = useRef(null);

    // Inicialização da API do YouTube
    useEffect(() => {
        bgm.stop();

        // 1. Carrega API se não existir
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // 2. Define callback global
        window.onYouTubeIframeAPIReady = initializePlayer;

        // 3. Se já carregada, inicializa manualmente
        if (window.YT && window.YT.Player) {
            initializePlayer();
        }
    }, []);

    const initializePlayer = () => {
        if (playerRef.current) return;

        try {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId: VSL_CONFIG.videoId,
                width: '100%',
                height: '100%',
                playerVars: {
                    autoplay: 1,
                    mute: 1, // Autoplay mobile requer mudo
                    controls: 1, // REQUERIDO: Botão de Pause Nativo (e barra)
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    fs: 0,
                    disablekb: 0, // Permite teclado se desktop
                    origin: window.location.origin
                },
                events: {
                    'onReady': onPlayerReady
                    // onStateChange removido pois não precisamos mais monitorar play/pause manualmente
                }
            });
        } catch (e) {
            console.error("YouTube API Init Error", e);
        }
    };

    const onPlayerReady = (event) => {
        // Tenta autoplay mudo
        event.target.mute();
        event.target.playVideo();
    };

    // Loop de Progresso (APENAS para lógica de oferta)
    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                const time = playerRef.current.getCurrentTime();
                if (onProgress) onProgress(time);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [onProgress]);

    return (
        <div
            className="vsl-container"
            style={{
                position: 'relative',
                paddingBottom: '56.25%',
                background: '#000',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
        >
            {/* WRAPPER COM ESCALA PARA REMOVER BORDAS */}
            <div
                id="youtube-player"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.1)',
                    width: '100%',
                    height: '100%',
                    transformOrigin: 'center center'
                }}
            />
            {/* SEM OVERLAYS CUSTOMIZADOS - CONTROLES NATIVOS ATIVADOS */}
        </div>
    );
};


const Results = () => {
    const [showOffer, setShowOffer] = useState(false);

    const navigate = useNavigate();

    const handleVideoProgress = (currentTime) => {
        // Smart Delay Logic
        if (!showOffer && currentTime >= VSL_CONFIG.offerDelaySeconds) {
            setShowOffer(true);
        }
    };

    const handleCheckout = (plan) => {
        window.location.href = 'https://www.elyondigital.com.br/checkout/73b4a49b-a89e-45e6-9f46-65be9fee24dd';
    };

    const scrollToPackages = (e) => {
        e.preventDefault();
        const element = document.getElementById('pacotes');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="container" style={{
            minHeight: '100vh',
            minHeight: '100dvh', // Mobile viewport fix
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 16px',
            paddingBottom: 'calc(40px + env(safe-area-inset-bottom))',
            background: 'linear-gradient(180deg, #FFF 0%, #FFF5F5 100%)'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                {/* --- HEADLINE --- */}
                <h1 className="text-center" style={{
                    color: '#1F2937',
                    marginBottom: '32px',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    lineHeight: '1.2',
                    fontWeight: '800'
                }}>
                    <span style={{ color: '#FB7C80' }}>A Verdade Sobre Recuperar o Corpo</span> no Pós-Parto — e o <span style={{ color: '#FB7C80' }}>Método Simples</span> Que Transformou Milhares de Mães em 30 Dias.
                </h1>

                {/* --- VSL PLAYER AREA --- */}
                <div style={{ marginBottom: '40px' }}>
                    <VSLPlayer onProgress={handleVideoProgress} />
                </div>

                {/* --- CONTEÚDO DA CARTA DE VENDAS (MOSTRADO APÓS DELAY) --- */}
                <div style={{
                    opacity: showOffer ? 1 : 0,
                    display: showOffer ? 'block' : 'none',
                    transition: 'opacity 1s ease-in-out'
                }}>

                    <div className="card card-futuristic animate-fade-in" style={{ padding: 'clamp(20px, 4vw, 32px)', marginBottom: '40px' }}>

                        {/* ATENÇÃO MÃE */}
                        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                            <h2 style={{ color: '#EF4444', fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase' }}>
                                🔥 ATENÇÃO MÃE: Seu Corpo Está Te Pedindo Socorro (E Você Está Ignorando)
                            </h2>
                        </div>

                        {/* PARE AGORA */}
                        <div style={{ marginBottom: '32px', background: '#FEF2F2', padding: '24px', borderRadius: '16px', border: '1px solid #FECaca' }}>
                            <p style={{ fontWeight: '800', color: '#B91C1C', marginBottom: '16px', fontSize: '1.2rem' }}>⚠️ PARE AGORA E LEIA ISSO SE VOCÊ:</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Se olha no espelho e não reconhece mais quem você é',
                                    'Evita tirar fotos ou usar aquela roupa que te deixava linda',
                                    'Sente que seu parceiro não te olha mais da mesma forma',
                                    'Acorda exausta mesmo depois de dormir',
                                    'Vê outras mães recuperadas e pensa: "por que comigo não funciona?"'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', fontSize: '1.1rem', color: '#1F2937' }}>
                                        <span style={{ marginRight: '10px' }}>❌</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ marginTop: '16px', fontStyle: 'italic', color: '#B91C1C', fontWeight: '600' }}>
                                Se você se identificou com pelo menos 2 desses pontos, continue lendo... <br />
                                Porque o que você vai descobrir nos próximos 3 minutos pode mudar completamente sua vida nos próximos 30 dias.
                            </p>
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <a href="#pacotes" onClick={scrollToPackages} style={{
                                    display: 'inline-block',
                                    background: '#EF4444',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '12px 24px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
                                    fontSize: '1rem'
                                }}>
                                    👉 QUERO MUDAR MINHA VIDA AGORA →
                                </a>
                            </div>
                        </div>

                        {/* A Verdade Que Ninguém Te Conta */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.4rem', color: '#1F2937', marginBottom: '16px', fontWeight: '700' }}>😢 A Verdade Que Ninguém Te Conta Sobre o Pós-Parto</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4B5563', marginBottom: '16px' }}>
                                Você deu à luz. Trouxe uma vida ao mundo.<br />
                                Mas ninguém te avisou que você também perderia a sua, não é?<br />
                                Ninguém te disse que você ia:
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Se sentir invisível enquanto todo mundo só olha pro bebê',
                                    'Ter vergonha do próprio corpo e evitar espelhos como se fossem inimigos',
                                    'Ouvir comentários maldosos tipo "nossa, ainda tá com barriga?" ou "vai amamentar com esse corpo?"',
                                    'Sentir que seu parceiro perdeu o interesse (mesmo que ele negue)',
                                    'Não ter energia nem pra tomar banho direito, quem dirá se cuidar'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', fontSize: '1.1rem', color: '#4B5563' }}>
                                        <span style={{ marginRight: '10px', color: '#9CA3AF' }}>•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Você tentou de tudo */}
                        <div style={{ marginBottom: '32px' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>E sabe o pior? <br />Você tentou de tudo:</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Aquelas dietas malucas que te deixaram com mais fome e menos resultado',
                                    'Métodos caríssimos que não cabem no seu orçamento',
                                    'Treinos complicados que você não tem tempo (nem energia) pra fazer',
                                    'Promessas vazias de "aceite seu corpo" enquanto você sofre por dentro'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', fontSize: '1.1rem', color: '#4B5563' }}>
                                        <span style={{ marginRight: '10px', color: '#EF4444', fontWeight: 'bold' }}>✗</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#EF4444', marginTop: '16px' }}>E nada funcionou.</p>
                        </div>

                        {/* O Que Acontece Se Você Não Agir AGORA */}
                        <div style={{ marginBottom: '32px', background: '#FFF5F5', padding: '24px', borderRadius: '16px' }}>
                            <h3 style={{ fontSize: '1.4rem', color: '#EF4444', marginBottom: '16px', fontWeight: '800' }}>💔 O Que Acontece Se Você Não Agir AGORA</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4B5563', marginBottom: '16px' }}>
                                Olha, eu vou ser direta com você porque você merece a verdade: <br />
                                Cada dia que passa sem fazer nada, você está:
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Perdendo mais autoestima — até chegar num ponto que você nem vai mais querer sair de casa',
                                    'Afastando seu parceiro — a intimidade esfria, a distância aumenta, e você já sabe onde isso pode terminar',
                                    'Criando hábitos ruins — que vão ficar ainda mais difíceis de reverter daqui 6 meses, 1 ano, 5 anos...',
                                    'Sendo ultrapassada — enquanto outras mães estão se recuperando, tirando fotos lindas, vivendo a melhor versão delas'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', fontSize: '1.1rem', color: '#1F2937' }}>
                                        <span style={{ marginRight: '10px' }}>🚨</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4B5563', marginTop: '16px' }}>
                                E o tempo não volta, mãe. <br />
                                Seu bebê só vai ter 3 meses <strong>UMA VEZ</strong> na vida. <br />
                                Você só vai viver <strong>ESSE</strong> momento <strong>UMA VEZ</strong>. <br /><br />
                                Você quer passar ele se sentindo mal? Ou quer aproveitar essa fase sendo a melhor versão de você?
                            </p>
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <a href="#pacotes" onClick={scrollToPackages} style={{
                                    display: 'inline-block',
                                    background: '#EF4444',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '12px 24px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
                                    fontSize: '1rem'
                                }}>
                                    👉 SIM, QUERO SER A MELHOR VERSÃO DE MIM →
                                </a>
                            </div>
                        </div>

                        {/* IMAGINE Acordar Daqui 30 Dias */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.4rem', color: '#10B981', marginBottom: '24px', fontWeight: '800', textAlign: 'center' }}>✨ IMAGINE Acordar Daqui 30 Dias E...</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Se olhar no espelho e finalmente GOSTAR do que vê',
                                    'Receber elogios que fazem seu coração bater mais forte',
                                    'Ver o olhar do seu parceiro mudando (aquele olhar que você sentia falta)',
                                    'Entrar naquele vestido que está guardado no armário desde antes da gravidez',
                                    'Postar uma foto e receber centenas de "WOW, você está LINDA!"',
                                    'Sentir inveja das outras mães quando elas virem sua transformação',
                                    'Ter energia de sobra pra cuidar do bebê E de você mesma'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px', fontSize: '1.15rem', color: '#374151', background: '#ECFDF5', padding: '12px', borderRadius: '8px' }}>
                                        <span style={{ marginRight: '12px' }}>🌟</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ fontSize: '1.2rem', textAlign: 'center', marginTop: '24px', fontWeight: '600', color: '#059669' }}>
                                Isso não é fantasia. <br />
                                É o que acontece quando você segue o método certo.
                            </p>
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <a href="#pacotes" onClick={scrollToPackages} style={{
                                    display: 'inline-block',
                                    background: '#10B981',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '12px 24px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
                                    fontSize: '1rem'
                                }}>
                                    👉 QUERO MINHA TRANSFORMAÇÃO AGORA →
                                </a>
                            </div>
                        </div>

                        {/* Apresento: TRANSFORMAÇÃO PÓS-PARTO */}
                        <div style={{ marginBottom: '40px', textAlign: 'center', border: '2px dashed #FB7C80', padding: 'clamp(16px, 4vw, 32px)', borderRadius: '16px', width: '100%', boxSizing: 'border-box' }}>
                            <h2 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.8rem)', color: '#FB7C80', marginBottom: '16px', fontWeight: '900', lineHeight: '1.3', wordBreak: 'break-word', hyphens: 'auto' }}>
                                🎯 Apresento: TRANSFORMAÇÃO PÓS-PARTO
                            </h2>
                            <h3 style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: '#1F2937', marginBottom: '24px', lineHeight: '1.5' }}>
                                O Único Método Completo, Simples e Acessível Para Mães Que Querem Recuperar o Corpo (e a Vida) em 30 Dias
                            </h3>
                            <p style={{ fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)', color: '#4B5563', lineHeight: '1.6' }}>
                                Sem dietas restritivas. <br />
                                Sem exercícios impossíveis. <br />
                                Sem gastar uma fortuna. <br /><br />
                                <strong>Apenas um passo a passo validado, prático e feito especialmente pra sua realidade de mãe.</strong>
                            </p>
                        </div>

                    </div>

                    {/* 6. OFERTA E PACOTES */}
                    <h2 id="pacotes" className="text-center" style={{ marginBottom: '32px', color: '#1F2937', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '800', scrollMarginTop: '20px' }}>📦 ESCOLHA SEU PACOTE</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>

                        {/* PACOTE ESSENCIAL */}
                        <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', border: '1px solid #E5E7EB', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '8px', fontWeight: '700' }}>💎 PACOTE ESSENCIAL</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '1.1rem' }}>R$ 47,00</span>
                                    <span style={{ color: '#10B981', fontWeight: '700', fontSize: '0.9rem' }}>(79% OFF)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1F2937', marginRight: '4px' }}>R$</span>
                                    <span style={{ fontSize: '3rem', fontWeight: '800', color: '#1F2937', lineHeight: '1' }}>10,00</span>
                                </div>
                            </div>

                            <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '24px', fontStyle: 'italic' }}>Ideal pra você que quer dar o primeiro passo com segurança</p>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#10B981" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>E-book Transformação Pós-Parto:</strong> Passo a passo completo pra recuperar seu corpo em 30 dias (sem complicação)</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#10B981" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>Planner de Rotina:</strong> Organização simples: refeições, água, sono e autocuidado (porque mãe não tem tempo a perder)</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#10B981" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>Acesso Vitalício:</strong> Pode consultar quando quiser, pra sempre</span>
                                </li>
                            </ul>

                            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem', color: '#6B7280' }}>
                                👉 Investimento único de R$ 10,00 <br />(menos que um açaí)
                            </div>

                            <button onClick={() => handleCheckout('essential')} className="btn btn-large" style={{ width: '100%', background: '#9CA3AF', fontSize: '1rem', padding: '16px' }}>
                                QUERO COMEÇAR MINHA TRANSFORMAÇÃO AGORA →
                            </button>
                        </div>

                        {/* PACOTE COMPLETO */}
                        <div className="card card-highlight" style={{ padding: 'clamp(20px, 4vw, 32px)', border: '2px solid #FB7C80', position: 'relative', background: '#FFF5F5', display: 'flex', flexDirection: 'column' }}>
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
                                boxShadow: '0 4px 6px rgba(251, 124, 128, 0.3)',
                                whiteSpace: 'nowrap'
                            }}>
                                🔥 MAIS VENDIDO
                            </div>

                            <h3 style={{ fontSize: '1.5rem', color: '#FB7C80', marginBottom: '8px', fontWeight: '800' }}>PACOTE COMPLETO</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '1.1rem' }}>R$ 97,00</span>
                                    <span style={{ color: '#EF4444', fontWeight: '700', fontSize: '0.9rem' }}>(72% OFF)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FB7C80', marginRight: '4px' }}>R$</span>
                                    <span style={{ fontSize: '3rem', fontWeight: '800', color: '#FB7C80', lineHeight: '1' }}>27,00</span>
                                </div>
                            </div>

                            <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '24px', fontStyle: 'italic' }}>A transformação COMPLETA — corpo, mente e rotina</p>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
                                    <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span>Tudo do Pacote Essencial</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>50 Receitas Rápidas:</strong> Refeições práticas e nutritivas (sem passar horas na cozinha)</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>Código do Conforto:</strong> Técnicas pra reduzir cólicas do bebê e melhorar o sono (bebê dormindo = mãe descansando)</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>Guia de Exercícios Seguros:</strong> Treinos leves pra recuperar força sem risco</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>Mindset do Emagrecimento:</strong> Como manter constância e autoestima ALTA</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>Grupo Exclusivo VIP:</strong> Apoio emocional, motivação e acompanhamento diário com outras mães na mesma jornada</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', color: '#4B5563' }}>
                                    <Check size={18} color="#FB7C80" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }} />
                                    <span><strong>Acesso Vitalício a TUDO</strong></span>
                                </li>
                            </ul>

                            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem', color: '#6B7280' }}>
                                👉 Investimento único de R$ 27,00 <br />(o preço de UMA ida ao salão)
                            </div>

                            <button onClick={() => handleCheckout('complete')} className="btn btn-large" style={{ width: '100%', fontSize: '1rem', padding: '16px' }}>
                                QUERO A TRANSFORMAÇÃO COMPLETA + GRUPO VIP →
                            </button>
                        </div>

                    </div>

                    {/* SCARCITY & URGENCY */}
                    <div style={{ background: '#FEF2F2', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px', marginBottom: '40px', border: '2px solid #FCA5A5' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#B91C1C', marginBottom: '24px', fontWeight: '800', textAlign: 'center' }}>⏰ MAS TEM UM PORÉM...</h3>
                        <p style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1.1rem' }}>Esta oferta é <strong>LIMITADA</strong>.</p>
                        <ul style={{ listStyle: 'none', padding: 0, maxWidth: '500px', margin: '0 auto' }}>
                            {['Só temos vagas limitadas no grupo exclusivo', 'Essa promoção EXPIRA em breve', 'O preço vai SUBIR assim que as vagas acabarem'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', fontSize: '1.1rem', color: '#7F1D1D' }}>
                                    <span style={{ marginRight: '10px', fontWeight: 'bold' }}>❗</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '1.1rem' }}>
                            Traduzindo: Se você sair dessa página agora e voltar depois, pode ser que seja tarde demais.<br />
                            E aí você vai <strong>Pagar MAIS CARO</strong>, perder o acesso ao grupo e continuar na mesma situação.
                        </p>
                    </div>

                    {/* GUARANTEE */}
                    <div style={{ textAlign: 'center', marginBottom: '40px', padding: 'clamp(20px, 4vw, 32px)', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                        <ShieldCheck size={48} color="#10B981" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.5rem', color: '#1F2937', marginBottom: '16px', fontWeight: '800' }}>🛡️ GARANTIA ZERO RISCO</h3>
                        <p style={{ fontSize: '1.1rem', color: '#4B5563', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                            Olha, eu sei que você pode estar pensando: "E se não funcionar pra mim?"<br /><br />
                            Por isso, você tem <strong>7 dias de garantia incondicional</strong>.<br />
                            Acessa, usa, aplica. Se por QUALQUER motivo você não gostar, é só pedir reembolso — sem perguntas, sem burocracia.<br /><br />
                            Ou seja: TODO o risco é MEU, não seu.
                        </p>
                    </div>

                    {/* Final Call to Action - 2 Options */}
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#1F2937', marginBottom: '24px', fontWeight: '800', textAlign: 'center' }}>⚡ ÚLTIMA CHAMADA: Faça Sua Escolha AGORA</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                            <div style={{ background: '#F3F4F6', padding: '24px', borderRadius: '16px' }}>
                                <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>OPÇÃO 1: Fechar essa página e continuar:</h4>
                                <ul style={{ paddingLeft: '20px', color: '#4B5563' }}>
                                    <li style={{ marginBottom: '8px' }}>Se sentindo mal com seu corpo</li>
                                    <li style={{ marginBottom: '8px' }}>Evitando espelhos e fotos</li>
                                    <li style={{ marginBottom: '8px' }}>Vendo outras mães se recuperarem enquanto você fica pra trás</li>
                                </ul>
                            </div>
                            <div style={{ background: '#ECFDF5', padding: '24px', borderRadius: '16px', border: '2px solid #10B981' }}>
                                <h4 style={{ fontWeight: '700', marginBottom: '16px', color: '#065F46' }}>OPÇÃO 2: Investir R$ 10 ou R$ 27 AGORA e em 30 dias:</h4>
                                <ul style={{ paddingLeft: '20px', color: '#065F46' }}>
                                    <li style={{ marginBottom: '8px' }}>Estar com o corpo que você sonha</li>
                                    <li style={{ marginBottom: '8px' }}>Recebendo elogios e olhares admirados</li>
                                    <li style={{ marginBottom: '8px' }}>Sentindo-se CONFIANTE, LINDA e PODEROSA</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* BONUS */}
                    <div style={{ marginBottom: '40px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px', color: 'white', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '800' }}>🎁 SEUS BÔNUS EXCLUSIVOS (SÓ HOJE)</h3>
                        <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Quem garantir a vaga AGORA leva de brinde:</p>
                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                            {[
                                '🎁 Checklist de Progresso Semanal (pra você acompanhar sua evolução)',
                                '🎁 Acesso prioritário a futuras atualizações',
                                '🎁 Suporte direto via grupo exclusivo (só no Pacote Completo)'
                            ].map((item, i) => (
                                <li key={i} style={{ fontSize: '1.1rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* FINAL BUTTONS REPEATED */}
                    <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: '#1F2937' }}>🚀 CLIQUE NO BOTÃO ABAIXO E GARANTA SUA VAGA</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px', margin: '0 auto' }}>
                            <button onClick={() => handleCheckout('essential')} className="btn" style={{ width: '100%', padding: '20px', fontSize: '1.1rem', background: '#9CA3AF' }}>
                                👇 PACOTE ESSENCIAL — R$ 10,00 <br />
                                <span style={{ fontSize: '0.9rem' }}>[QUERO COMEÇAR MINHA TRANSFORMAÇÃO AGORA →]</span>
                            </button>
                            <button onClick={() => handleCheckout('complete')} className="btn pulse-animation" style={{ width: '100%', padding: '20px', fontSize: '1.1rem', background: '#FB7C80', boxShadow: '0 4px 14px rgba(251, 124, 128, 0.4)' }}>
                                👇 PACOTE COMPLETO — R$ 27,00 🔥 MAIS ESCOLHIDO <br />
                                <span style={{ fontSize: '0.9rem' }}>[QUERO A TRANSFORMAÇÃO COMPLETA + GRUPO VIP →]</span>
                            </button>
                        </div>
                    </div>

                    {/* Fechamento Emocional */}
                    <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#FB7C80', marginBottom: '24px', fontWeight: '800' }}>❤️ Uma Última Coisa...</h3>
                        <p style={{ fontSize: '1.2rem', color: '#4B5563', marginBottom: '16px', lineHeight: '1.6' }}>
                            Você merece se sentir <strong>LINDA</strong>. <br />
                            Você merece se sentir <strong>PODEROSA</strong>. <br />
                            Você merece se olhar no espelho e <strong>AMAR</strong> o que vê.
                        </p>
                        <p style={{ fontSize: '1.2rem', color: '#4B5563', marginBottom: '32px' }}>
                            Não deixe mais um dia passar. <br />
                            Seu bebê precisa de uma mãe FELIZ e CONFIANTE. <br />
                            Seu parceiro quer ver você RADIANTE de novo. <br />
                            E principalmente: <strong>VOCÊ merece isso.</strong> <br /><br />
                            Nos vemos do outro lado. 💪💕
                        </p>

                        <div style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: '700px', margin: '0 auto', textAlign: 'left', background: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
                            <p style={{ marginBottom: '8px' }}><strong>P.S.:</strong> Lembra que as vagas são limitadas? Enquanto você lê isso, outras mães já estão garantindo a delas. Não deixe pra depois. CLIQUE AGORA.</p>
                            <p><strong>P.P.S.:</strong> Garantia de 7 dias. Literalmente ZERO risco pra você. A única coisa que você pode perder é a oportunidade de se transformar AGORA.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default Results;
