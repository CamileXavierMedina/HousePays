import { useState, useEffect, Suspense } from 'react';
import useRotas from './Hooks/useRotas';
import usePessoas from './Hooks/usePessoas';
import useTransacoes from './Hooks/useTransacoes';
import LayoutPadrao from './Layouts/LayoutPadrao';
import PaginaDashboard from './Paginas/PaginaDashboard';
import PaginaPessoas from './Paginas/PaginaPessoas';
import PaginaTransacoes from './Paginas/PaginaTransacoes';
import FronteiraErro from './Componentes/FronteiraErro';
import Carregando from './Componentes/Carregando';
import ModalConfirmacao from './Componentes/ModalConfirmacao';
import BannerNotificacao from './Componentes/BannerNotificacao';

export default function App() {
    const { rota, navegarPara } = useRotas();
    const {
        pessoasPromise,
        pessoaSelecionada,
        setPessoaSelecionada,
        loadingDetalhes,
        formCadastro,
        setFormCadastro,
        erroCadastro,
        setErroCadastro,
        recarregar,
        cadastrar: cadastrarMorador,
        excluir: excluirMorador,
        obterDetalhes
    } = usePessoas();

    // Notificações temporárias de feedback para substituir popups de alert()
    const [notificacao, setNotificacao] = useState<{
        mensagem: string | null;
        tipo: 'sucesso' | 'erro' | 'info';
    }>({ mensagem: null, tipo: 'info' });

    // Estado do Modal de Confirmação customizado para substituir confirm()
    const [modalExcluir, setModalExcluir] = useState<{
        aberto: boolean;
        id: string;
        nome: string;
    }>({ aberto: false, id: '', nome: '' });

    const {
        formTransacao,
        setFormTransacao,
        erroTransacao,
        setErroTransacao,
        loadingCadastro: loadingCadastroTransacao,
        cadastrar: executarCadastroTransacao
    } = useTransacoes(() => {
        // Callback executado ao registrar a transação com sucesso
        recarregar();
        setNotificacao({
            mensagem: 'Transação financeira lançada com sucesso!',
            tipo: 'sucesso'
        });
        navegarPara('dashboard');
    });

    // Auto-ocultar banner de feedback após 4 segundos
    useEffect(() => {
        if (notificacao.mensagem) {
            const timer = setTimeout(() => {
                setNotificacao({ mensagem: null, tipo: 'info' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [notificacao.mensagem]);

    const handleCadastrarMorador = async (nome: string, idade: number) => {
        try {
            await cadastrarMorador(nome, idade);
            setNotificacao({
                mensagem: `Morador '${nome}' cadastrado com sucesso!`,
                tipo: 'sucesso'
            });
        } catch (err: any) {
            setNotificacao({
                mensagem: err.message || 'Erro ao cadastrar morador.',
                tipo: 'erro'
            });
        }
    };

    const handleConfirmarExclusao = async () => {
        try {
            const nomeExcluido = modalExcluir.nome;
            await excluirMorador(modalExcluir.id);
            setNotificacao({
                mensagem: `Morador '${nomeExcluido}' e todas as suas transações foram excluídos com sucesso!`,
                tipo: 'sucesso'
            });
        } catch (err: any) {
            setNotificacao({
                mensagem: err.message || 'Erro ao excluir morador.',
                tipo: 'erro'
            });
        } finally {
            setModalExcluir({ aberto: false, id: '', nome: '' });
        }
    };

    return (
        <LayoutPadrao
            rotaAtual={rota}
            onNavegar={navegarPara}
            onSincronizar={() => {
                recarregar();
                setNotificacao({ mensagem: 'Base de dados sincronizada!', tipo: 'info' });
            }}
        >
            <div className="space-y-6">
                {/* Banner de Feedback visual flutuante ou fixado */}
                {notificacao.mensagem && (
                    <div className="animate-fade-in">
                        <BannerNotificacao
                            mensagem={notificacao.mensagem}
                            tipo={notificacao.tipo}
                            onClose={() => setNotificacao({ mensagem: null, tipo: 'info' })}
                        />
                    </div>
                )}

                {/* Área de conteúdo gerenciada por Suspense e ErrorBoundary */}
                <FronteiraErro>
                    <Suspense fallback={<Carregando />}>
                        {rota === 'dashboard' && (
                            <PaginaDashboard
                                pessoasPromise={pessoasPromise}
                                onVisualizarPessoa={(id) => {
                                    navegarPara('pessoas');
                                    obterDetalhes(id);
                                }}
                                onExcluirPessoa={(id, nome) => 
                                    setModalExcluir({ aberto: true, id, nome })
                                }
                            />
                        )}

                        {rota === 'pessoas' && (
                            <PaginaPessoas
                                pessoasPromise={pessoasPromise}
                                formCadastro={formCadastro}
                                setFormCadastro={setFormCadastro}
                                erroCadastro={erroCadastro}
                                setErroCadastro={setErroCadastro}
                                onCadastrar={handleCadastrarMorador}
                                onExcluirPessoa={(id, nome) => 
                                    setModalExcluir({ aberto: true, id, nome })
                                }
                                pessoaSelecionada={pessoaSelecionada}
                                setPessoaSelecionada={setPessoaSelecionada}
                                loadingDetalhes={loadingDetalhes}
                                obterDetalhes={obterDetalhes}
                            />
                        )}

                        {rota === 'transacoes' && (
                            <PaginaTransacoes
                                pessoasPromise={pessoasPromise}
                                formTransacao={formTransacao}
                                setFormTransacao={setFormTransacao}
                                erroTransacao={erroTransacao}
                                setErroTransacao={setErroTransacao}
                                onCadastrarTransacao={executarCadastroTransacao}
                                loadingCadastro={loadingCadastroTransacao}
                            />
                        )}
                    </Suspense>
                </FronteiraErro>
            </div>

            {/* Modal de Confirmação customizado (substitui o confirm() padrão) */}
            <ModalConfirmacao
                aberto={modalExcluir.aberto}
                titulo="Confirmar Exclusão"
                mensagem={`Aviso Importante: Excluir o morador '${modalExcluir.nome}' apagará permanentemente todas as transações vinculadas a ele no banco de dados SQLite! Deseja continuar?`}
                onConfirmar={handleConfirmarExclusao}
                onCancelar={() => setModalExcluir({ aberto: false, id: '', nome: '' })}
            />
        </LayoutPadrao>
    );
}