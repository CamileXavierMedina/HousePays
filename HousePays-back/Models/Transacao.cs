using System;

namespace HousePays.Models
{
    public enum TipoTransacao
    {
        Receita,
        Despesa
    }

    public class Transacao
    {
        //id unico gerado
        public Guid Id { get; set; } = Guid.NewGuid();

        //oque e gasto ou ganho
        public string Descricao { get; set; } = string.Empty;

        //valor da transacao
        public decimal Valor { get; set; }

        //se é receita(1) ou despesa(0)
        public TipoTransacao Tipo { get; set; }

        //foreign key da pessoa q fez a transação
        public Guid PessoaId { get; set; }

        //propriedade de navegacao
        public Pessoa? Pessoa { get; set; }

    }
}

