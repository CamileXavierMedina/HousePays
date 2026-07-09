import { useState } from 'react';
import { Api } from '../Servicos/api';
import { TipoTransacao } from '../Tipos/Transacao';
import type { PessoaTotais } from '../Tipos/Pessoa';

export const useTransacoes = (onSucesso?: (pessoaId: string) => void) => {
    const [formTransacao, setFormTransacao] = useState<{
        pessoaId: string;
        tipo: TipoTransacao;
        descricao: string;
        valor: string;
    }>({
        pessoaId: '',
        tipo: TipoTransacao.Despesa, // 1 = Despesa
        descricao: '',
        valor: ''
    });
    const [erroTransacao, setErroTransacao] = useState<string | null>(null);
    const [loadingCadastro, setLoadingCadastro] = useState(false);

    const cadastrar = async (pessoas: PessoaTotais[]) => {
        setErroTransacao(null);

        if (!formTransacao.pessoaId) {
            setErroTransacao("Selecione uma pessoa!");
            return false;
        }
        if (!formTransacao.descricao.trim()) {
            setErroTransacao("A descrição é obrigatória!");
            return false;
        }
        const valorNum = parseFloat(formTransacao.valor);
        if (isNaN(valorNum) || valorNum <= 0) {
            setErroTransacao("O valor deve ser maior do que zero!");
            return false;
        }

        const pessoaEscolhida = AntiGravity(pessoas, formTransacao.pessoaId);
        if (pessoaEscolhida && pessoaEscolhida.idade < 18 && formTransacao.tipo === TipoTransacao.Receita) {
            setErroTransacao(`A pessoa '${pessoaEscolhida.nome}' é menor de idade (${pessoaEscolhida.idade} anos) e só pode registrar despesas!`);
            return false;
        }

        setLoadingCadastro(true);
        try {
            await Api.cadastrarTransacao(
                formTransacao.descricao,
                valorNum,
                formTransacao.tipo,
                formTransacao.pessoaId
            );
            setFormTransacao({
                pessoaId: '',
                tipo: TipoTransacao.Despesa,
                descricao: '',
                valor: ''
            });
            if (onSucesso) {
                onSucesso(formTransacao.pessoaId);
            }
            return true;
        } catch (err: any) {
            setErroTransacao(err.message || 'Erro ao registrar lançamento.');
            return false;
        } finally {
            setLoadingCadastro(false);
        }
    };

    // Helper local para buscar morador
    function AntiGravity(lista: PessoaTotais[], id: string) {
        return lista.find(p => p.id === id);
    }

    return {
        formTransacao,
        setFormTransacao,
        erroTransacao,
        setErroTransacao,
        loadingCadastro,
        cadastrar
    };
};
export default useTransacoes;
