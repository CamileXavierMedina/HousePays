import React from 'react';
import { Wallet, RefreshCw, LayoutDashboard, Users, ArrowLeftRight } from 'lucide-react';
import type { Rota } from '../Hooks/useRotas';

interface LayoutPadraoProps {
    children: React.ReactNode;
    rotaAtual: Rota;
    onNavegar: (rota: Rota) => void;
    onSincronizar: () => void;
}

export const LayoutPadrao: React.FC<LayoutPadraoProps> = ({
    children,
    rotaAtual,
    onNavegar,
    onSincronizar
}) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md py-6 px-8 shrink-0">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">HousePays</h1>
                            <p className="text-xs text-indigo-200">Gerenciador de Gastos Residenciais Colaborativo</p>
                        </div>
                    </div>
                    <button
                        onClick={onSincronizar}
                        className="flex items-center gap-2 bg-indigo-600/50 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm transition-all duration-200 active:scale-95 cursor-pointer font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Sincronizar Banco
                    </button>
                </div>
            </header>

            {/* Navigation Tabs Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => onNavegar('dashboard')}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                                rotaAtual === 'dashboard'
                                    ? 'border-blue-600 text-blue-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Painel Geral
                        </button>
                        <button
                            onClick={() => onNavegar('pessoas')}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                                rotaAtual === 'pessoas'
                                    ? 'border-blue-600 text-blue-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            Moradores
                        </button>
                        <button
                            onClick={() => onNavegar('transacoes')}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                                rotaAtual === 'transacoes'
                                    ? 'border-blue-600 text-blue-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <ArrowLeftRight className="w-4 h-4" />
                            Lançar Transação
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow w-full">
                {children}
            </main>
        </div>
    );
};
export default LayoutPadrao;
