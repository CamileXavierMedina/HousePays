import { useState, useEffect } from 'react';

export type Rota = 'dashboard' | 'pessoas' | 'transacoes';

export const useRotas = () => {
    const obterRotaHash = (): Rota => {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'pessoas' || hash === 'transacoes') {
            return hash;
        }
        return 'dashboard';
    };

    const [rota, setRota] = useState<Rota>(obterRotaHash);

    useEffect(() => {
        const handleHashChange = () => {
            setRota(obterRotaHash());
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const navegarPara = (novaRota: Rota) => {
        window.location.hash = novaRota;
    };

    return {
        rota,
        navegarPara
    };
};
export default useRotas;
