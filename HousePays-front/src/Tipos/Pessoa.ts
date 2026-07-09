// regras de tipos para garantir que o morador tenha os dados certos no front
import type { Transacao } from './Transacao';

export interface Pessoa {
    id: string;
    nome: string;
    idade: number;
}

export interface PessoaCompleta extends Pessoa {
    transacoes: Transacao[];
}

export interface PessoaTotais extends Pessoa {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface RelatorioTotais {
    pessoas: PessoaTotais[];
    totalReceitasGeral: number;
    totalDespesasGeral: number;
    saldoLiquidoGeral: number;
}
