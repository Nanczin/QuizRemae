import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import logo from '../assets/logo.png';
import { sfx } from '../utils/sounds';

const questions = [
    {
        id: 1,
        question: 'Como você tem se sentido com o próprio corpo desde o parto?',
        options: [
            'Não me reconheço mais',
            'Me sinto cansada e desmotivada',
            'Me sinto perdida, tentando lidar com tudo',
            'Estou melhorando, mas ainda travada'
        ]
    },
    {
        id: 2,
        question: 'O que mais está te incomodando no seu corpo hoje?',
        options: [
            'Barriga flácida / pochete',
            'Cintura sumiu',
            'Braços/pernas moles',
            'Inchaço',
            'Minha autoestima caiu'
        ]
    },
    {
        id: 3,
        question: 'No seu dia a dia, o que mais atrapalha sua recuperação?',
        options: [
            'Falta de energia',
            'Falta de tempo',
            'Falta de organização',
            'Falta de orientação',
            'Tudo junto'
        ]
    },
    {
        id: 4,
        question: 'Hoje, quantas vezes por semana você consegue tirar 10 a 20 minutos só pra você?',
        options: [
            'Nenhuma',
            '1 ou 2',
            '3 ou 4',
            'Quase todos os dias'
        ]
    },
    {
        id: 5,
        question: 'Como está sua alimentação no momento?',
        options: [
            'Totalmente desregulada',
            'Como o que dá',
            'Tenho tentado melhorar',
            'Estou me esforçando'
        ]
    },
    {
        id: 6,
        question: 'Você sente que tem apoio emocional nessa fase?',
        options: [
            'Não',
            'Pouco',
            'Às vezes',
            'Sim, mas ainda fico sobrecarregada'
        ]
    },
    {
        id: 7,
        question: 'Quando tenta melhorar, o que mais te trava?',
        options: [
            'Não sei por onde começar',
            'Não tenho um plano simples',
            'Não consigo manter constância',
            'Tentei métodos que não funcionam para pós-parto',
            'Falta orientação segura'
        ]
    },
    {
        id: 8,
        question: 'Quanto tempo por dia você acredita que conseguiria dedicar à sua recuperação se tivesse um método simples?',
        options: [
            '5 minutos',
            '10 minutos',
            '15 minutos',
            '20 minutos',
            'Depende, mas eu tentaria'
        ]
    },
    {
        id: 9,
        question: 'Se você pudesse mudar UMA coisa nos próximos 30 dias, qual seria?',
        options: [
            'Reduzir barriga e flacidez',
            'Organizar rotina e alimentação',
            'Ter mais energia e autoestima',
            'Voltar a gostar de mim no espelho',
            'Dormir melhor e me sentir leve'
        ]
    },
    {
        id: 10,
        question: 'Qual dessas frases você mais concorda?',
        options: [
            'Eu mereço se sentir bem de novo',
            'Preciso me organizar para voltar a gostar de mim',
            'Posso melhorar mesmo com pouco tempo',
            'É possível transformar corpo e rotina com orientação certa',
            'Quero recuperar minha força e confiança'
        ]
    },
    {
        id: 11,
        question: 'Se você tivesse um plano simples, rápido e seguro… você estaria disposta a se comprometer consigo mesma?',
        options: [
            'Sim, eu preciso disso',
            'Sim, só preciso de orientação',
            'Quero muito, mas tenho medo',
            'Não sei, me sinto insegura'
        ]
    }
];

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isAnimating, setIsAnimating] = useState(false);
    const [showAchievement, setShowAchievement] = useState(null);
    const navigate = useNavigate();

    const handleAnswer = (answer) => {
        if (isAnimating) return;

        // 1. Play Sound
        sfx.click.play();

        // 2. Haptic Feedback (Mobile)
        if (navigator.vibrate) navigator.vibrate(50);

        // 3. Confetti Burst
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#FB7C80', '#FEB4B4', '#FFFFFF']
        });

        setIsAnimating(true);
        setAnswers({ ...answers, [currentQuestion]: answer });

        // 4. Gamification Logic (Achievements)
        const nextQ = currentQuestion + 1;
        let delay = 400;

        if (nextQ === 3) {
            triggerAchievement("✨ Consciência Corporal Desbloqueada!");
            delay = 1500;
        } else if (nextQ === 7) {
            triggerAchievement("🚀 Você está no caminho certo!");
            delay = 1500;
        } else if (nextQ === 10) {
            triggerAchievement("👑 Perfil Quase Completo!");
            delay = 1500;
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setIsAnimating(false);
                setShowAchievement(null);
            } else {
                sfx.success.play();
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                setTimeout(() => navigate('/memory-game'), 1000);
            }
        }, delay);
    };

    const triggerAchievement = (text) => {
        sfx.achievement.play();
        setShowAchievement(text);
        confetti({
            particleCount: 60,
            spread: 100,
            origin: { y: 0.5 },
            gravity: 0.8,
            scalar: 1.2
        });
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const question = questions[currentQuestion];

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '20px 16px', background: 'linear-gradient(180deg, #FFF 0%, #FFF5F5 100%)', position: 'relative', overflow: 'hidden' }}>

            {/* Achievement Overlay */}
            {showAchievement && (
                <div className="animate-fade-in" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.95)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        boxShadow: '0 20px 50px rgba(251, 124, 128, 0.25)',
                        textAlign: 'center',
                        border: '2px solid #FEB4B4',
                        maxWidth: '400px',
                        width: '100%',
                        animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <Trophy size={48} color="#FB7C80" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.25rem', color: '#1F2937', marginBottom: '8px', lineHeight: '1.3' }}>{showAchievement}</h3>
                        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Continue assim, mãe!</p>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Logo Section */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', paddingTop: '10px' }}>
                    <img src={logo} alt="Método RE-MÃE" style={{ height: '80px', objectFit: 'contain', maxWidth: '100%' }} />
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '40px', position: 'relative' }}>
                    <div style={{ height: '12px', background: 'rgba(251, 124, 128, 0.1)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'var(--gradient-primary)',
                            borderRadius: '10px',
                            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 0 15px rgba(251, 124, 128, 0.6)',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                right: '0',
                                top: '0',
                                bottom: '0',
                                width: '20px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                                animation: 'shimmer 1s infinite'
                            }}></div>
                        </div>
                    </div>
                    {/* Gamification Badge on Progress */}
                    <div style={{
                        position: 'absolute',
                        right: `${100 - progress}%`,
                        top: '-10px',
                        transform: 'translateX(50%)',
                        transition: 'right 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: 'white',
                        borderRadius: '50%',
                        padding: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                        <Star size={16} fill="#FB7C80" color="#FB7C80" />
                    </div>
                </div>

                {/* Question Card */}
                <div className={`card card-futuristic ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ border: 'none', padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                    <h2 style={{ marginBottom: '32px', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', background: 'linear-gradient(90deg, #1F2937 0%, #4B5563 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', textAlign: 'center', lineHeight: '1.3' }}>
                        {question.question}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                onMouseEnter={() => sfx.hover.play()}
                                className="btn quiz-option"
                                style={{
                                    background: 'white',
                                    color: 'var(--color-text)',
                                    border: '1px solid #F3F4F6',
                                    justifyContent: 'space-between',
                                    padding: '20px 24px',
                                    fontSize: '1rem',
                                    textAlign: 'left',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    borderRadius: '16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <span style={{ position: 'relative', zIndex: 1, flex: 1 }}>{option}</span>
                                <ChevronRight size={20} color="var(--color-primary)" style={{ opacity: 0.6, flexShrink: 0, marginLeft: '8px' }} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Mobile Optimizations */
        @media (max-width: 640px) {
          .card-futuristic {
            padding: 24px 16px !important;
          }
          .quiz-option {
            padding: 16px 20px !important;
            font-size: 0.95rem !important;
          }
          .container {
            padding: 16px 12px !important;
          }
        }

        /* Tablet Optimizations */
        @media (min-width: 641px) and (max-width: 1024px) {
          .container {
            padding: 32px !important;
          }
          .card-futuristic {
            padding: 40px !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Quiz;
