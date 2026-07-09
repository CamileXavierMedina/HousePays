// dados necessarios para registrar uma transaçao que vem do front-end
using System;

namespace HousePays.Modelos.Dtos
{
    public class TransacaoCadastroDto
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public Guid PessoaId { get; set; }
    }
}
