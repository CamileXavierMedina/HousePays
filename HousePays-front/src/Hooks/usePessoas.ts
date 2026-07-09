import { useState, useCallback } from 'react';
import { Api } from '../Servicos/api';
import type { PessoaCompleta, RelatorioTotais } from '../Tipos/Pessoa';

export const usePessoas = () => {
    const [pessoasPromise, setPessoasPromise] = useState<Promise<RelatorioTotais>>(() => Api.obterTotaisPessoas());
    const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaCompleta | null>(null);
    const [loadingDetalhes, setLoadingDetalhes] = useState(false);
    const [loadingMutacao, setLoadingMutacao] = useState(false);
    
    const [formCadastro, setFormCadastro] = useState({
        nome: '',
        idade: ''
    });
    const [erroCadastro, setErroCadastro] = useState<string | null>(null);

    const recarregar = useCallback(() => {
        setPessoasPromise(Api.obterTotaisPessoas());
    }, []);

    const cadastrar = async (nome: string, idade: number) => {
        setErroCadastro(null);
        setLoadingMutacao(true);
        try {
            await Api.cadastrarPessoa(nome, idade);
            setFormCadastro({ nome: '', idade: '' });
            recarregar();
        } catch (err: any) {
            setErroCadastro(err.message || 'Erro ao cadastrar morador.');
            throw err;
        } finally {
            setLoadingMutacao(false);
        }
    };

    const excluir = async (id: string) => {
        setLoadingMutacao(true);
        try {
            await Api.excluirPessoa(id);
            if (pessoaSelecionada?.id === id) {
                setPessoaSelecionada(null);
            }
            recarregar();
        } catch (err: any) {
            throw err;
        } finally {
            setLoadingMutacao(false);
        }
    };

    const obterDetalhes = async (id: string) => {
        setLoadingDetalhes(true);
        try {
            const todasPessoas = await Api.obterPessoas();
            const encontrada = todasPessoas.find(p => p.id === id);
            if (encontrada) {
                setPessoaSelecionada(encontrada);
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes", err);
        } finally {
            setLoadingDetalhes(false);
        }
    };

    return {
        pessoasPromise,
        pessoaSelecionada,
        setPessoaSelecionada,
        loadingDetalhes,
        loadingMutacao,
        formCadastro,
        setFormCadastro,
        erroCadastro,
        setErroCadastro,
        recarregar,
        cadastrar,
        excluir,
        obterDetalhes
    };
};
export default usePessoas;
