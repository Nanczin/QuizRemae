import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, CheckCircle, Database, Lock, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const DiagnosisLoading = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Iniciando análise...');
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 50); // 5 seconds total

        const timeouts = [
            setTimeout(() => setMessage('Processando suas respostas...'), 1000),
            setTimeout(() => setMessage('Identificando padrão metabólico...'), 2500),
            setTimeout(() => setMessage('Personalizando seu plano de recuperação...'), 4000),
            setTimeout(() => {
                setMessage('Análise Concluída!');
                setShowResult(true);
            }, 5500)
        ];

        return () => {
            clearInterval(interval);
            timeouts.forEach(clearTimeout);
        };
    }, []);

    if (showResult) {
        return (
            <div className="container" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                background: 'linear-gradient(180deg, #FFF 0%, #FFF5F5 100%)'
            }}>
                <div className="card card-futuristic animate-fade-in" style={{
                    maxWidth: '600px',
                    width: '100%',
                    padding: '40px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <img src={logo} alt="Método RE-MÃE" style={{ height: '60px', marginBottom: '24px', objectFit: 'contain' }} />

                    <div style={{ marginBottom: '24px', background: '#ECFDF5', padding: '12px 24px', borderRadius: '30px', color: '#065F46', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        <CheckCircle size={20} style={{ marginRight: '8px' }} />
                        Diagnóstico Completo
                    </div>

                    <h2 style={{ fontSize: '1.75rem', color: '#1F2937', marginBottom: '24px', lineHeight: '1.3' }}>
                        Mãe, identificamos exatamente o que você precisa.
                    </h2>

                    <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '24px', lineHeight: '1.6', textAlign: 'left' }}>
                        A análise das suas respostas mostra que seu corpo está pronto para recuperar a forma, mas precisa do estímulo certo para reativar o metabolismo e fortalecer a musculatura abdominal sem causar lesões.
                    </p>

                    <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '32px', lineHeight: '1.6', textAlign: 'left' }}>
                        Criamos um plano personalizado que respeita sua rotina e foca em resultados rápidos e seguros.
                    </p>

                    <button
                        onClick={() => navigate('/results')}
                        className="btn btn-large"
                        style={{
                            width: '100%',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Ver Meu Plano e Vídeo Explicativo
                        <ArrowRight size={24} style={{ marginLeft: '12px' }} />
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            background: 'linear-gradient(180deg, #FFF 0%, #FFF5F5 100%)'
        }}>
            <div className="card card-futuristic" style={{
                maxWidth: '500px',
                width: '100%',
                padding: '40px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                <img src={logo} alt="Método RE-MÃE" style={{ height: '60px', marginBottom: '32px', objectFit: 'contain' }} />

                <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '32px' }}>
                    {/* Spinner Circle */}
                    <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="#F3F4F6"
                            strokeWidth="8"
                            fill="transparent"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="#FB7C80"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="339.292"
                            strokeDashoffset={339.292 - (339.292 * progress) / 100}
                            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                        />
                    </svg>
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#FB7C80'
                    }}>
                        {progress}%
                    </div>
                </div>

                <h2 style={{ fontSize: '1.25rem', color: '#1F2937', marginBottom: '16px', minHeight: '30px' }}>
                    {message}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '24px' }}>
                    <LoadingStep label="Análise de Perfil" done={progress > 30} />
                    <LoadingStep label="Mapeamento de Sintomas" done={progress > 60} />
                    <LoadingStep label="Geração de Estratégia" done={progress > 90} />
                </div>

                <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', color: '#9CA3AF', fontSize: '0.875rem' }}>
                    <Lock size={14} style={{ marginRight: '6px' }} />
                    Ambiente Seguro e Criptografado
                </div>

            </div>
        </div>
    );
};

const LoadingStep = ({ label, done }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        background: done ? '#ECFDF5' : '#F9FAFB',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
    }}>
        <span style={{ color: done ? '#065F46' : '#6B7280', fontWeight: done ? '600' : '400' }}>{label}</span>
        {done ? <CheckCircle size={20} color="#10B981" /> : <Activity size={20} color="#D1D5DB" className="animate-pulse" />}
    </div>
);

export default DiagnosisLoading;
