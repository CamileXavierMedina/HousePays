import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface BannerNotificacaoProps {
    mensagem: string | null;
    tipo?: 'sucesso' | 'erro' | 'info';
    onClose?: () => void;
}

export const BannerNotificacao: React.FC<BannerNotificacaoProps> = ({ mensagem, tipo = 'info', onClose }) => {
    if (!mensagem) return null;

    let classeContainer = '';
    let classeTexto = '';
    let classeIcone = '';
    let Icone = Info;

    switch (tipo) {
        case 'sucesso':
            classeContainer = 'bg-emerald-50 border-emerald-500';
            classeTexto = 'text-emerald-800';
            classeIcone = 'text-emerald-500';
            Icone = CheckCircle;
            break;
        case 'erro':
            classeContainer = 'bg-rose-50 border-rose-500';
            classeTexto = 'text-rose-800';
            classeIcone = 'text-rose-500';
            Icone = AlertCircle;
            break;
        case 'info':
            classeContainer = 'bg-blue-50 border-blue-500';
            classeTexto = 'text-blue-800';
            classeIcone = 'text-blue-500';
            Icone = Info;
            break;
    }

    return (
        <div className={`border-l-4 p-4 rounded-r-lg flex items-start justify-between gap-3 shadow-xs transition-all ${classeContainer}`}>
            <div className="flex gap-3">
                <Icone className={`w-5 h-5 shrink-0 mt-0.5 ${classeIcone}`} />
                <div className={`text-sm font-medium ${classeTexto}`}>{mensagem}</div>
            </div>
            {onClose && (
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
export default BannerNotificacao;
