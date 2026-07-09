import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Botao from './Botao';

interface ModalConfirmacaoProps {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    onConfirmar: () => void;
    onCancelar: () => void;
    carregando?: boolean;
}

export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
    aberto,
    titulo,
    mensagem,
    onConfirmar,
    onCancelar,
    carregando
}) => {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={onCancelar}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 overflow-hidden animate-fade-in-up">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-rose-50 rounded-full text-rose-600 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{titulo}</h3>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{mensagem}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Botao 
                        variante="secundario" 
                        onClick={onCancelar}
                        disabled={carregando}
                    >
                        Cancelar
                    </Botao>
                    <Botao 
                        variante="perigo" 
                        onClick={onConfirmar}
                        carregando={carregando}
                    >
                        Confirmar Exclusão
                    </Botao>
                </div>
            </div>
        </div>
    );
};
export default ModalConfirmacao;
