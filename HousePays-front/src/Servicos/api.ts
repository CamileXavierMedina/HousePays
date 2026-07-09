import { CONFIG } from '../Constantes/config';
import type { Pessoa, PessoaCompleta, RelatorioTotais } from '../Tipos/Pessoa';
import { TipoTransacao, type Transacao } from '../Tipos/Transacao';

export const Api = {
    // busca moradores cadastrados na api
    async obterPessoas(): Promise<PessoaCompleta[]> {
        const response = await fetch(`${CONFIG.API_URL}/pessoas`);
        if (!response.ok) {
            const txtErro = await response.text();
            throw new Error(txtErro || 'Erro ao carregar moradores.');
        }
        return response.json();
    },

    // busca o relatorio financeiro com os saldos consolidados
    async obterTotaisPessoas(): Promise<RelatorioTotais> {
        const response = await fetch(`${CONFIG.API_URL}/pessoas/totais`);
        if (!response.ok) {
            const txtErro = await response.text();
            throw new Error(txtErro || 'Erro ao carregar relatório de totais.');
        }
        return response.json();
    },

    // envia os dados para inserir um novo morador
    async cadastrarPessoa(nome: string, idade: number): Promise<Pessoa> {
        const response = await fetch(`${CONFIG.API_URL}/pessoas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, idade })
        });
        if (!response.ok) {
            const txtErro = await response.text();
            throw new Error(txtErro || 'Erro ao cadastrar morador.');
        }
        return response.json();
    },

    // envia requisicao para deletar um morador
    async excluirPessoa(id: string): Promise<void> {
        const response = await fetch(`${CONFIG.API_URL}/pessoas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const txtErro = await response.text();
            throw new Error(txtErro || 'Erro ao excluir morador.');
        }
    },

    // busca a listagem de todas as transaçoes lançadas
    async obterTransacoes(): Promise<Transacao[]> {
        const response = await fetch(`${CONFIG.API_URL}/transacoes`);
        if (!response.ok) {
            const txtErro = await response.text();
            throw new Error(txtErro || 'Erro ao carregar transações.');
        }
        return response.json();
    },

    // envia os dados para registrar uma nova transaçao no banco
    async cadastrarTransacao(descricao: string, valor: number, tipo: TipoTransacao, pessoaId: string): Promise<Transacao> {
        const response = await fetch(`${CONFIG.API_URL}/transacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descricao, valor, tipo, pessoaId })
        });
        if (!response.ok) {
            const txtErro = await response.text();
            throw new Error(txtErro || 'Erro ao cadastrar transação.');
        }
        return response.json();
    }
};
export default Api;
