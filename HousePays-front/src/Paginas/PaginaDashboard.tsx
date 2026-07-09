import React, { use } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Eye, Trash2 } from 'lucide-react';
import { Card } from '../Componentes/Card';
import type { RelatorioTotais } from '../Tipos/Pessoa';

interface PaginaDashboardProps {
    pessoasPromise: Promise<RelatorioTotais>;
    onVisualizarPessoa: (id: string) => void;
    onExcluirPessoa: (id: string, nome: string) => void;
}

export const PaginaDashboard: React.FC<PaginaDashboardProps> = ({
    pessoasPromise,
    onVisualizarPessoa,
    onExcluirPessoa
}) => {
    // resolve a promise do backend usando o hook use() do react 19
    const relatorio = use(pessoasPromise);
    const { pessoas, totalReceitasGeral, totalDespesasGeral, saldoLiquidoGeral } = relatorio;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* dashboard financeiro */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    titulo="Receitas Totais"
                    valor={totalReceitasGeral}
                    icone={<ArrowUpCircle className="w-12 h-12 text-blue-500/20" />}
                    tipo="sucesso"
                />
                <Card
                    titulo="Despesas Totais"
                    valor={totalDespesasGeral}
                    icone={<ArrowDownCircle className="w-12 h-12 text-red-500/20" />}
                    tipo="erro"
                />
                <Card
                    titulo="Saldo Líquido Geral"
                    valor={saldoLiquidoGeral}
                    icone={<Wallet className="w-12 h-12 text-amber-500/20" />}
                    tipo={saldoLiquidoGeral >= 0 ? 'alerta' : 'erro'}
                />
            </section>

            {/* tabela de totais por pessoa */}
            <section className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Totais por Pessoa</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Visão do saldo e da saúde financeira de cada morador</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-semibold">
                        {pessoas.length} Cadastros Ativos
                    </span>
                </div>

                {pessoas.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                        Nenhum morador cadastrado no sistema.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100/40 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-4 px-6 font-semibold">Morador</th>
                                    <th className="py-4 px-6 font-semibold">Idade</th>
                                    <th className="py-4 px-6 font-semibold text-blue-600">Receitas</th>
                                    <th className="py-4 px-6 font-semibold text-red-600">Despesas</th>
                                    <th className="py-4 px-6 font-semibold">Saldo Líquido</th>
                                    <th className="py-4 px-6 font-semibold text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pessoas.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="py-4 px-6 font-bold text-slate-700">{p.nome}</td>
                                        <td className="py-4 px-6 text-slate-500 text-sm">{p.idade} anos</td>
                                        <td className="py-4 px-6 text-blue-600 font-medium">
                                            R$ {p.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-4 px-6 text-red-600 font-medium">
                                            R$ {p.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className={`py-4 px-6 font-bold ${p.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            R$ {p.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => onVisualizarPessoa(p.id)}
                                                    title="Visualizar Extrato Dinâmico"
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onExcluirPessoa(p.id, p.nome)}
                                                    title="Remover Cadastro"
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};
export default PaginaDashboard;
