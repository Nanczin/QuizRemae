import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan');

    const isComplete = plan === 'complete';
    const price = isComplete ? '27,00' : '10,00';
    const title = isComplete ? 'Pacote Completo' : 'Pacote Essencial';

    return (
        <div className="container" style={{ minHeight: '100dvh', padding: '40px 16px', paddingBottom: 'calc(40px + env(safe-area-inset-bottom))', background: '#F9FAFB' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

                {/* Order Summary */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>Resumo do Pedido</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span>{title}</span>
                        <span style={{ fontWeight: '700' }}>R$ {price}</span>
                    </div>
                    {isComplete && (
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '16px' }}>
                            Inclui: E-book, Planner, Receitas, Guia de Exercícios, Código do Conforto, Mindset, Grupo de Apoio.
                        </div>
                    )}
                    {!isComplete && (
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '16px' }}>
                            Inclui: E-book, Planner de Rotina.
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', fontSize: '1.25rem', fontWeight: '700' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--color-primary)' }}>R$ {price}</span>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '24px' }}>Dados de Pagamento</h3>
                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>Nome Completo</label>
                            <input type="text" className="w-full" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Como no cartão" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>E-mail</label>
                            <input type="email" className="w-full" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Para receber o acesso" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>Número do Cartão</label>
                            <input type="text" className="w-full" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="0000 0000 0000 0000" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>Validade</label>
                                <input type="text" className="w-full" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="MM/AA" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>CVV</label>
                                <input type="text" className="w-full" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="123" />
                            </div>
                        </div>

                        <button className="btn btn-large" style={{ marginTop: '16px' }}>
                            Finalizar Compra Segura
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#9CA3AF' }}>
                            <p>🔒 Pagamento 100% Seguro. Seus dados estão protegidos.</p>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
