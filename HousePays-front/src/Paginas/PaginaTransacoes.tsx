import React, { use } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../Componentes/Input';
import { Botao } from '../Componentes/Botao';
import type { RelatorioTotais } from '../Tipos/Pessoa';
import { TipoTransacao } from '../Tipos/Transacao';

interface PaginaTransacoesProps {
    pessoasPromise: Promise<RelatorioTotais>;
    formTransacao: {
        pessoaId: string;
        tipo: TipoTransacao;
        descricao: string;
        valor: string;
    };
    setFormTransacao: React.Dispatch<React.SetStateAction<{
        pessoaId: string;
        tipo: TipoTransacao;
        descricao: string;
        valor: string;
    }>>;
    erroTransacao: string | null;
    setErroTransacao: (err: string | null) => void;
    onCadastrarTransacao: (pessoas: any[]) => Promise<boolean>;
    loadingCadastro: boolean;
}

export const PaginaTransacoes: React.FC<PaginaTransacoesProps> = ({
    pessoasPromise,
    formTransacao,
    setFormTransacao,
    erroTransacao,
    setErroTransacao,
    onCadastrarTransacao,
    loadingCadastro
}) => {
    // Resolve os moradores usando use()
    const relatorio = use(pessoasPromise);
    const { pessoas } = relatorio;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onCadastrarTransacao(pessoas);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-100 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-800">Lançar Transação Financeira</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Pessoa Responsável</label>
                        <select
                            value={formTransacao.pessoaId}
                            onChange={(e) => {
                                setFormTransacao({ ...formTransacao, pessoaId: e.target.value });
                                setErroTransacao(null);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                            <option value="">Selecione...</option>
                            {pessoas.map(p => (
                                <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo da Movimentação</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormTransacao({ ...formTransacao, tipo: TipoTransacao.Receita })}
                                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    formTransacao.tipo === TipoTransacao.Receita
                                        ? 'bg-emerald-500 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                🟢 Receita
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormTransacao({ ...formTransacao, tipo: TipoTransacao.Despesa })}
                                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    formTransacao.tipo === TipoTransacao.Despesa
                                        ? 'bg-rose-500 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                🔴 Despesa
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                        <Input
                            rotulo="Descrição"
                            placeholder="Ex: Compra de Supermercado"
                            value={formTransacao.descricao}
                            onChange={(e) => setFormTransacao({ ...formTransacao, descricao: e.target.value })}
                        />
                    </div>
                    <div>
                        <Input
                            rotulo="Valor (R$)"
                            placeholder="0.00"
                            value={formTransacao.valor}
                            onChange={(e) => setFormTransacao({ ...formTransacao, valor: e.target.value })}
                        />
                    </div>
                </div>

                {erroTransacao && (
                    <p className="text-xs text-rose-600 font-semibold flex items-start gap-1">
                        <Plus className="w-3.5 h-3.5 shrink-0 mt-0.5" /> <span>{erroTransacao}</span>
                    </p>
                )}

                <Botao
                    type="submit"
                    variante="sucesso"
                    className="w-full py-2.5"
                    carregando={loadingCadastro}
                    icone={<Plus className="w-4 h-4" />}
                >
                    Registrar Lançamento
                </Botao>
            </form>
        </div>
    );
};
export default PaginaTransacoes;
