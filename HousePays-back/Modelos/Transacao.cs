// representa a tabela de transaçoes no banco de dados com valor, tipo e morador
using System;

namespace HousePays.Modelos
{
    public class Transacao
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public Guid PessoaId { get; set; }
        public Pessoa? Pessoa { get; set; }
    }
}
