// icone giratorio de carregamento para mostrar enquanto os dados nao chegam
import React from 'react';
import { RefreshCw } from 'lucide-react';

export const Carregando: React.FC = () => {
    return (
        <div className="w-full py-16 flex flex-col justify-center items-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium">Buscando dados no banco de dados SQLite...</p>
        </div>
    );
};
export default Carregando;
