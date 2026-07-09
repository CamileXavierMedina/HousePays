import React, { use } from 'react';
import { Plus, Eye, Trash2, RefreshCw } from 'lucide-react';
import { Input } from '../Componentes/Input';
import { Botao } from '../Componentes/Botao';
import type { RelatorioTotais, PessoaCompleta } from '../Tipos/Pessoa';

interface PaginaPessoasProps {
    pessoasPromise: Promise<RelatorioTotais>;
    formCadastro: { nome: string; idade: string };
    setFormCadastro: React.Dispatch<React.SetStateAction<{ nome: string; idade: string }>>;
    erroCadastro: string | null;
    setErroCadastro: (err: string | null) => void;
    onCadastrar: (nome: string, idade: number) => Promise<void>;
    onExcluirPessoa: (id: string, nome: string) => void;
    pessoaSelecionada: PessoaCompleta | null;
    setPessoaSelecionada: (pessoa: PessoaCompleta | null) => void;
    loadingDetalhes: boolean;
    obterDetalhes: (id: string) => Promise<void>;
}

export const PaginaPessoas: React.FC<PaginaPessoasProps> = ({
    pessoasPromise,
    formCadastro,
    setFormCadastro,
    erroCadastro,
    setErroCadastro,
    onCadastrar,
    onExcluirPessoa,
    pessoaSelecionada,
    setPessoaSelecionada,
    loadingDetalhes,
    obterDetalhes
}) => {
    // resolve os totais de pessoas com react 19 use()
    const relatorio = use(pessoasPromise);
    const { pessoas } = relatorio;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErroCadastro(null);

        if (!formCadastro.nome.trim()) {
            setErroCadastro("O nome é obrigatório!");
            return;
        }
        const idadeNum = parseInt(formCadastro.idade);
        if (isNaN(idadeNum) || idadeNum < 0) {
            setErroCadastro("A idade deve ser um número maior ou igual a zero!");
            return;
        }

        try {
            await onCadastrar(formCadastro.nome, idadeNum);
        } catch (err: any) {
            // errocadastro ja e tratado no hook de pessoas
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* formulario de cadastro de moradores */}
                <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 h-fit">
                    <div className="flex items-center gap-2 mb-4">
                        <Plus className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-800">Cadastrar Novo Morador</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            rotulo="Nome Completo"
                            placeholder="Ex: Camile Xavier"
                            value={formCadastro.nome}
                            onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })}
                        />
                        <Input
                            rotulo="Idade"
                            type="number"
                            placeholder="Ex: 25"
                            value={formCadastro.idade}
                            onChange={(e) => setFormCadastro({ ...formCadastro, idade: e.target.value })}
                            erro={erroCadastro}
                        />
                        <Botao type="submit" className="w-full" icone={<Plus className="w-4 h-4" />}>
                            Cadastrar Pessoa
                        </Botao>
                    </form>
                </div>

                {/* listagem simplificada de moradores */}
                <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Moradores Cadastrados</h2>
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
                                        <th className="py-3 px-4 font-semibold">Nome</th>
                                        <th className="py-3 px-4 font-semibold">Idade</th>
                                        <th className="py-3 px-4 font-semibold text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pessoas.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/20">
                                            <td className="py-3 px-4 font-bold text-slate-700">{p.nome}</td>
                                            <td className="py-3 px-4 text-slate-500 text-sm">{p.idade} anos</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => obterDetalhes(p.id)}
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
                </div>
            </div>

            {/* extrato da pessoa selecionada */}
            {pessoaSelecionada && (
                <section className="bg-white rounded-2xl shadow-md border-2 border-blue-500/20 overflow-hidden animate-fade-in-down">
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-slate-50/30 flex justify-between items-center">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Histórico de Transações</span>
                            <h2 className="text-xl font-bold text-slate-800 mt-1">{pessoaSelecionada.nome.toUpperCase()}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{pessoaSelecionada.idade} anos de idade</p>
                        </div>
                        <button
                            onClick={() => setPessoaSelecionada(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                            Recolher Histórico
                        </button>
                    </div>

                    {loadingDetalhes ? (
                        <div className="py-8 text-center text-slate-400 text-sm flex justify-center items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Atualizando extrato...
                        </div>
                    ) : pessoaSelecionada.transacoes.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-sm">
                            Nenhuma movimentação lançada para este morador.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100/40 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                        <th className="py-3 px-6 font-semibold"># Sequencial</th>
                                        <th className="py-3 px-6 font-semibold">Tipo</th>
                                        <th className="py-3 px-6 font-semibold">Descrição</th>
                                        <th className="py-3 px-6 font-semibold">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pessoaSelecionada.transacoes.map((t, index) => (
                                        <tr key={t.id} className="hover:bg-slate-50/20">
                                            <td className="py-3.5 px-6 text-slate-400 font-mono text-sm">{index + 1}</td>
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${t.tipo === 0
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                                    : 'bg-red-50 text-red-700 border border-red-100'
                                                    }`}>
                                                    {t.tipo === 0 ? 'Receita' : 'Despesa'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 font-medium text-slate-700">{t.descricao}</td>
                                            <td className={`py-3.5 px-6 font-bold ${t.tipo === 0 ? 'text-blue-600' : 'text-slate-700'}`}>
                                                R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};
export default PaginaPessoas;
