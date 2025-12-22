import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PixelTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Verifica se o Facebook Pixel está carregado
        if (window.fbq) {
            // Rastreia o evento PageView a cada mudança de rota
            window.fbq('track', 'PageView');
        } else {
            console.warn('Facebook Pixel (window.fbq) not found on route change.');
        }
    }, [location]);

    return null;
};

export default PixelTracker;
