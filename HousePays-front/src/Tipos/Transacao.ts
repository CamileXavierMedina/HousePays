// regras de tipos para garantir que a transaçao tenha os dados certos no front
export const TipoTransacao = {
    Receita: 0,
    Despesa: 1
} as const;

export type TipoTransacao = typeof TipoTransacao[keyof typeof TipoTransacao];

export interface Transacao {
    id: string;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    pessoaId: string;
}
