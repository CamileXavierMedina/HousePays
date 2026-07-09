using System;

namespace HousePays.Modelos.Dtos
{
    public class PessoaTotaisDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}
