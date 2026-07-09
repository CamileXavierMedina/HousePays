import { useState, useEffect } from 'react';
import { Eye, Trash2, Plus, Wallet, ArrowUpCircle, ArrowDownCircle, Info, RefreshCw, AlertCircle } from 'lucide-react';

//se a API do C# estiver rodando em uma porta diferente troque aqui embaixo
const API_BASE_URL = 'http://localhost:5200';

//regras
interface PessoaTotais {
    id: string;
    nome: string;
    idade: number;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

interface Transacao {
    id: string;
    descricao: string;
    valor: number;
    tipo: number; //0=R /1=D
    pessoaId: string;
}

interface PessoaCompleta {
    id: string;
    nome: string;
    idade: number;
    transacoes: Transacao[];
}

export default function App() {
    //estados para dados API
    const [pessoas, setPessoas] = useState<PessoaTotais[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //estado para detalhar
    const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaCompleta | null>(null);
    const [loadingDetalhes, setLoadingDetalhes] = useState<boolean>(false);

    //estados dos forms de Cadastro
    const [novoNome, setNovoNome] = useState<string>('');
    const [novaIdade, setNovaIdade] = useState<string>('');

    const [novaDescricao, setNovaDescricao] = useState<string>('');
    const [novoValor, setNovoValor] = useState<string>('');
    const [novoTipo, setNovoTipo] = useState<number>(1); //padrao de: 1 = D
    const [novoPessoaId, setNovoPessoaId] = useState<string>('');

    //msg de erro locais nos forms
    const [erroPessoa, setErroPessoa] = useState<string | null>(null);
    const [erroTransacao, setErroTransacao] = useState<string | null>(null);

    //busca inicial dos totais do Back
    const carregarDados = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/pessoas/totais`);
            if (!response.ok) {
                throw new Error('Não foi possível conectar ao Back-end. Certifique-se de que a API está rodando!');
            }
            const dados = await response.json();
            setPessoas(dados);
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    //busca os detalhes e histórico de transações ao clicar
    const carregarDetalhesPessoa = async (id: string) => {
        setLoadingDetalhes(true);
        try {
            const response = await fetch(`${API_BASE_URL}/pessoas`);
            if (response.ok) {
                const todasPessoas: PessoaCompleta[] = await response.json();
                const encontrada = todasPessoas.find(p => p.id === id);
                if (encontrada) {
                    setPessoaSelecionada(encontrada);
                }
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes", err);
        } finally {
            setLoadingDetalhes(false);
        }
    };

    //envia o cadastro de uma nova pessoa
    const handleCadastrarPessoa = async (e: React.FormEvent) => {
        e.preventDefault();
        setErroPessoa(null);

        if (!novoNome.trim()) {
            setErroPessoa("O nome é obrigatório!");
            return;
        }
        const idadeNum = parseInt(novaIdade);
        if (isNaN(idadeNum) || idadeNum < 0) {
            setErroPessoa("A idade deve ser um número maior ou igual a zero!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pessoas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: novoNome, idade: idadeNum })
            });

            if (!response.ok) {
                const txtErro = await response.text();
                throw new Error(txtErro || "Erro ao cadastrar pessoa");
            }

            setNovoNome('');
            setNovaIdade('');
            carregarDados();
        } catch (err: any) {
            setErroPessoa(err.message);
        }
    };

    //envia o cadastro de nova transac.
    const handleCadastrarTransacao = async (e: React.FormEvent) => {
        e.preventDefault();
        setErroTransacao(null);

        if (!novoPessoaId) {
            setErroTransacao("Selecione uma pessoa!");
            return;
        }
        if (!novaDescricao.trim()) {
            setErroTransacao("A descrição é obrigatória!");
            return;
        }
        const valorNum = parseFloat(novoValor);
        if (isNaN(valorNum) || valorNum <= 0) {
            setErroTransacao("O valor deve ser maior do que zero!");
            return;
        }

        const pessoaEscolhida = pessoas.find(p => p.id === novoPessoaId);
        if (pessoaEscolhida && pessoaEscolhida.idade < 18 && novoTipo === 0) {
            setErroTransacao(`A pessoa '${pessoaEscolhida.nome}' é menor de idade (${pessoaEscolhida.idade} anos) e só pode registrar despesas!`);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/transacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    descricao: novaDescricao,
                    valor: valorNum,
                    tipo: novoTipo,
                    pessoaId: novoPessoaId
                })
            });

            if (!response.ok) {
                const txtErro = await response.text();
                throw new Error(txtErro || "Erro ao cadastrar transação");
            }

            setNovaDescricao('');
            setNovoValor('');
            carregarDados();

         
            if (pessoaSelecionada && pessoaSelecionada.id === novoPessoaId) {
                carregarDetalhesPessoa(novoPessoaId);
            }
        } catch (err: any) {
            setErroTransacao(err.message);
        }
    };

    //exclui pessoa (cascata) no banco de dados
    const handleExcluirPessoa = async (id: string) => {
        if (!confirm("Aviso Importante: Excluir esta pessoa apagará permanentemente todas as transações vinculadas a ela no banco de dados SQLite! Deseja continuar?")) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pessoas/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir pessoa");
            }
            if (pessoaSelecionada && pessoaSelecionada.id === id) {
                setPessoaSelecionada(null);
            }

            carregarDados();
        } catch (err: any) {
            alert(err.message);
        }
    };

    //calculos para os cards superiores
    const totalReceitasGeral = pessoas.reduce((acc, p) => acc + p.totalReceitas, 0);
    const totalDespesasGeral = pessoas.reduce((acc, p) => acc + p.totalDespesas, 0);
    const saldoGeral = totalReceitasGeral - totalDespesasGeral;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* header */}
            <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md py-6 px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">HousePays</h1>
                            <p className="text-xs text-indigo-200">Gerenciador de Gastos Residenciais Colaborativo</p>
                        </div>
                    </div>
                    <button
                        onClick={carregarDados}
                        className="flex items-center gap-2 bg-indigo-600/50 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm transition-all duration-200 active:scale-95"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Sincronizar Banco
                    </button>
                </div>
            </header>

            {/* main container */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

                {/* alerta de erro de conexao com a API */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-800">Falha ao se conectar à API C#</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                            <p className="text-xs text-red-600 mt-2">Dica: Confirme qual porta a sua API do Visual Studio está usando e ajuste o campo "API_BASE_URL" no início do arquivo App.tsx!</p>
                        </div>
                    </div>
                )}

                {/*dashboard financeiro */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Receitas Totais</p>
                            <h3 className="text-2xl font-extrabold text-slate-800 mt-2">
                                R$ {totalReceitasGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <ArrowUpCircle className="w-12 h-12 text-emerald-500/20" />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Despesas Totais</p>
                            <h3 className="text-2xl font-extrabold text-slate-800 mt-2">
                                R$ {totalDespesasGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <ArrowDownCircle className="w-12 h-12 text-rose-500/20" />
                    </div>

                    <div className={`p-6 rounded-2xl shadow-xs border flex items-center justify-between transition-colors ${saldoGeral >= 0 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
                        }`}>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo Líquido Geral</p>
                            <h3 className={`text-2xl font-extrabold mt-2 ${saldoGeral >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                R$ {saldoGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <Wallet className={`w-12 h-12 ${saldoGeral >= 0 ? 'text-emerald-500/20' : 'text-rose-500/20'}`} />
                    </div>
                </section>

                {/* forms de cadastro */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* cadastro de pessoas */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Plus className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-slate-800">Cadastrar Novo Morador</h2>
                        </div>

                        <form onSubmit={handleCadastrarPessoa} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Camile Xavier"
                                        value={novoNome}
                                        onChange={(e) => setNovoNome(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Idade</label>
                                    <input
                                        type="number"
                                        placeholder="Idade"
                                        value={novaIdade}
                                        onChange={(e) => setNovaIdade(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {erroPessoa && (
                                <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                                    <Info className="w-3.5 h-3.5 shrink-0" /> {erroPessoa}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 text-sm transition-all duration-150 active:scale-[0.99] flex justify-center items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Cadastrar Pessoa
                            </button>
                        </form>
                    </div>

                    {/* cadastro de trnasac. */}
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Plus className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-lg font-bold text-slate-800">Lançar Transação Financeira</h2>
                        </div>

                        <form onSubmit={handleCadastrarTransacao} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Pessoa Responsável</label>
                                    <select
                                        value={novoPessoaId}
                                        onChange={(e) => {
                                            setNovoPessoaId(e.target.value);
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
                                            onClick={() => setNovoTipo(0)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${novoTipo === 0
                                                    ? 'bg-emerald-500 text-white shadow-xs'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            🟢 Receita
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNovoTipo(1)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all ${novoTipo === 1
                                                    ? 'bg-rose-500 text-white shadow-xs'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            Despesa
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Compra de Supermercado"
                                        value={novaDescricao}
                                        onChange={(e) => setNovaDescricao(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Valor (R$)</label>
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={novoValor}
                                        onChange={(e) => setNovoValor(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {erroTransacao && (
                                <p className="text-xs text-rose-600 font-semibold flex items-start gap-1">
                                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> <span>{erroTransacao}</span>
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2 text-sm transition-all duration-150 active:scale-[0.99] flex justify-center items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Registrar Lançamento
                            </button>
                        </form>
                    </div>
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

                    {loading ? (
                        <div className="py-12 flex justify-center items-center gap-2 text-slate-400">
                            <RefreshCw className="w-5 h-5 animate-spin" /> Carregando base de dados do SQLite...
                        </div>
                    ) : pessoas.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-sm">
                            Nenhuma pessoa cadastrada. Use o formulário acima para cadastrar o primeiro morador!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100/40 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                        <th className="py-4 px-6 font-semibold">Morador</th>
                                        <th className="py-4 px-6 font-semibold">Idade</th>
                                        <th className="py-4 px-6 font-semibold text-emerald-600">Receitas</th>
                                        <th className="py-4 px-6 font-semibold text-rose-600">Despesas</th>
                                        <th className="py-4 px-6 font-semibold">Saldo Líquido</th>
                                        <th className="py-4 px-6 font-semibold text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pessoas.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="py-4 px-6 font-bold text-slate-700">{p.nome}</td>
                                            <td className="py-4 px-6 text-slate-500 text-sm">{p.idade} anos</td>
                                            <td className="py-4 px-6 text-emerald-600 font-medium">
                                                R$ {p.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-4 px-6 text-rose-600 font-medium">
                                                R$ {p.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className={`py-4 px-6 font-bold ${p.saldo >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                R$ {p.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => carregarDetalhesPessoa(p.id)}
                                                        title="Visualizar Extrato Dinâmico"
                                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleExcluirPessoa(p.id)}
                                                        title="Remover Cadastro"
                                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
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

                {/* extrato da pessoa selec. */}
                {pessoaSelecionada && (
                    <section className="bg-white rounded-2xl shadow-md border-2 border-blue-500/20 overflow-hidden animate-fade-in-down">
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 flex justify-between items-center">
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
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                                                        }`}>
                                                        {t.tipo === 0 ? 'Receita' : 'Despesa'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6 font-medium text-slate-700">{t.descricao}</td>
                                                <td className={`py-3.5 px-6 font-bold ${t.tipo === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
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

            </main>
        </div>
    );
}