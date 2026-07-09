import React from 'react';

interface CardProps {
    titulo: string;
    valor: number;
    icone: React.ReactNode;
    tipo?: 'sucesso' | 'erro' | 'padrao';
}

export const Card: React.FC<CardProps> = ({ titulo, valor, icone, tipo = 'padrao' }) => {
    let classesContainer = 'bg-white border-slate-100';
    let classesValor = 'text-slate-800';

    if (tipo === 'sucesso') {
        classesContainer = 'bg-emerald-50/50 border-emerald-100';
        classesValor = 'text-emerald-700';
    } else if (tipo === 'erro') {
        classesContainer = 'bg-rose-50/50 border-rose-100';
        classesValor = 'text-rose-700';
    }

    return (
        <div className={`p-6 rounded-2xl shadow-xs border flex items-center justify-between transition-colors ${classesContainer}`}>
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{titulo}</p>
                <h3 className={`text-2xl font-extrabold mt-2 ${classesValor}`}>
                    R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
            </div>
            <div className="opacity-80">
                {icone}
            </div>
        </div>
    );
};
export default Card;
