import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 16px', background: 'linear-gradient(180deg, #FFF 0%, #FFF5F5 100%)' }}>
      <div className="card card-futuristic" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', border: 'none', textAlign: 'center' }}>

        <div style={{ marginBottom: '32px' }}>
          <img src={logo} alt="Método RE-MÃE" style={{ height: '100px', objectFit: 'contain' }} />
        </div>

        <h1 style={{
          color: 'var(--color-text)',
          marginBottom: '24px',
          fontSize: '1.75rem',
          background: 'linear-gradient(90deg, #1F2937 0%, #4B5563 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Descubra seu Perfil de Recuperação Pós-Parto e Desbloqueie Seu Plano Personalizado de Transformação em 30 Dias
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#4B5563', marginBottom: '40px', lineHeight: '1.6' }}>
          Mãe, em poucos minutos você vai descobrir o que realmente está impedindo sua recuperação no pós-parto — e qual é o caminho mais rápido, leve e seguro para transformar seu corpo, sua rotina e sua autoestima.
          <br /><br />
          Responda com sinceridade e avance. No final, você libera um jogo especial e recebe seu plano personalizado.
        </p>

        <button onClick={() => navigate('/quiz')} className="btn btn-large" style={{ fontSize: '1.25rem', padding: '20px 32px' }}>
          Começar o Quiz
        </button>
      </div>
    </div>
  );
};

export default Home;
