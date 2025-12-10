import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Activity, Calendar, Smile, AlertCircle, Users, Clock, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/sounds';

// Import images
import card1 from '../assets/card1.png';
import card2 from '../assets/card2.png';
import card3 from '../assets/card3.png';
import card4 from '../assets/card4.png';
import card5 from '../assets/card5.png';
import card6 from '../assets/card6.png';

const cardsData = [
    { id: 1, content: 'Corpo mudado', type: 'problem', pairId: 1, image: card1, matchIcon: <User size={20} /> },
    { id: 2, content: 'Treinos leves', type: 'solution', pairId: 1, image: card2, matchIcon: <User size={20} /> },
    { id: 3, content: 'Rotina caótica', type: 'problem', pairId: 2, image: card3, matchIcon: <Clock size={20} /> },
    { id: 4, content: 'Planejamento', type: 'solution', pairId: 2, image: card4, matchIcon: <Clock size={20} /> },
    { id: 5, content: 'Cansaço', type: 'problem', pairId: 3, image: card5, matchIcon: <Heart size={20} /> },
    { id: 6, content: 'Apoio', type: 'solution', pairId: 3, image: card6, matchIcon: <Heart size={20} /> },
];

const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const shuffled = [...cardsData]; // .sort(() => Math.random() - 0.5);
        setCards(shuffled);
    }, []);

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        // Play Flip Sound
        sfx.flip.play();

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            const firstId = flipped[0];
            const secondId = id;
            setFlipped([firstId, secondId]);

            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);

            if (firstCard.pairId === secondCard.pairId) {
                setSolved([...solved, firstId, secondId]);
                setFlipped([]);
                setDisabled(false);

                // Play Match Sound
                sfx.match.play();
                confetti({
                    particleCount: 20,
                    spread: 40,
                    origin: { y: 0.6 },
                    colors: ['#10B981', '#34D399']
                });

                if (solved.length + 2 === cards.length) {
                    setTimeout(() => {
                        setShowSuccess(true);
                        sfx.success.play();
                        confetti({
                            particleCount: 150,
                            spread: 100,
                            origin: { y: 0.6 }
                        });
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 16px', background: 'linear-gradient(180deg, #FFF 0%, #FFF5F5 100%)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                {/* Title: Only shown when game is NOT finished */}
                {!showSuccess && (
                    <h2 className="text-center" style={{ marginBottom: '24px', color: 'var(--color-primary)', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                        Jogo da Memória
                    </h2>
                )}

                {!showSuccess ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                        gap: '12px',
                        justifyContent: 'center',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <style>{`
               .memory-grid {
                 display: grid;
                 grid-template-columns: repeat(3, 1fr);
                 gap: 16px;
               }
               @media (max-width: 480px) {
                 .memory-grid {
                   gap: 8px;
                 }
               }
             `}</style>
                        <div className="memory-grid" style={{ width: '100%' }}>
                            {cards.map((card) => {
                                const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
                                const isSolved = solved.includes(card.id);

                                return (
                                    <div
                                        key={card.id}
                                        onClick={() => handleClick(card.id)}
                                        style={{
                                            aspectRatio: '3/4',
                                            perspective: '1000px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                                        }}>
                                            {/* Front (Cover) */}
                                            <div style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                background: 'var(--gradient-primary)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                border: '2px solid white'
                                            }}>
                                                <span style={{ fontSize: '2rem', color: 'white' }}>?</span>
                                            </div>

                                            {/* Back (Content) */}
                                            <div style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)',
                                                background: isSolved ? '#ECFDF5' : 'white',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                border: isSolved ? '2px solid #10B981' : '2px solid var(--color-primary)',
                                                overflow: 'hidden'
                                            }}>
                                                <img src={card.image} alt={card.content} style={{ width: '100%', height: '50%', objectFit: 'cover' }} />

                                                <div style={{
                                                    height: '50%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-evenly',
                                                    padding: '4px',
                                                    width: '100%',
                                                    background: isSolved ? '#ECFDF5' : 'white'
                                                }}>
                                                    {/* Match Icon Indicator */}
                                                    <div style={{
                                                        color: isSolved ? '#10B981' : 'var(--color-primary)',
                                                        background: isSolved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 124, 128, 0.1)',
                                                        borderRadius: '50%',
                                                        padding: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {card.matchIcon}
                                                    </div>

                                                    <span style={{
                                                        fontSize: 'clamp(0.65rem, 3vw, 0.85rem)',
                                                        fontWeight: '600',
                                                        color: 'var(--color-text)',
                                                        textAlign: 'center',
                                                        lineHeight: '1.2',
                                                        margin: '2px 0'
                                                    }}>
                                                        {card.content}
                                                    </span>

                                                    {/* Type Label */}
                                                    <span style={{
                                                        fontSize: '0.6rem',
                                                        textTransform: 'uppercase',
                                                        color: card.type === 'problem' ? '#EF4444' : '#10B981',
                                                        fontWeight: '700',
                                                        letterSpacing: '0.5px',
                                                        background: card.type === 'problem' ? '#FEF2F2' : '#ECFDF5',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {card.type === 'problem' ? 'Problema' : 'Solução'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="card card-futuristic text-center animate-fade-in" style={{ padding: '40px' }}>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '16px', fontSize: '2rem' }}>🎉 Combinação Perfeita!</h2>
                        <p style={{ fontSize: '1.25rem', marginBottom: '32px', color: '#4B5563' }}>
                            Você entendeu que para cada desafio do pós-parto, existe uma solução leve e segura.
                            <br /><br />
                            Seu perfil foi analisado com sucesso.
                        </p>
                        <button onClick={() => navigate('/diagnosis-loading')} className="btn btn-large" style={{ fontSize: '1.25rem' }}>
                            Ver Meu Plano Personalizado
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryGame;
