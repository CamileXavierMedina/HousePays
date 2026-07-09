import React from 'react';

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: 'primario' | 'secundario' | 'perigo' | 'sucesso';
    icone?: React.ReactNode;
    carregando?: boolean;
}

export const Botao: React.FC<BotaoProps> = ({
    children,
    variante = 'primario',
    icone,
    carregando,
    className = '',
    disabled,
    ...props
}) => {
    let classeVariante = '';

    switch (variante) {
        case 'primario':
            classeVariante = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/20';
            break;
        case 'secundario':
            classeVariante = 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-500/20';
            break;
        case 'perigo':
            classeVariante = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/20';
            break;
        case 'sucesso':
            classeVariante = 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500/20';
            break;
    }

    return (
        <button
            disabled={disabled || carregando}
            className={`flex justify-center items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed focus:outline-hidden focus:ring-2 ${classeVariante} ${className}`}
            {...props}
        >
            {carregando ? (
                <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                icone
            )}
            {children}
        </button>
    );
};
export default Botao;
