// estrutura para devolver o relatorio financeiro completo da casa com saldo geral
using System.Collections.Generic;

namespace HousePays.Modelos.Dtos
{
    public class RelatorioTotaisDto
    {
        public IEnumerable<PessoaTotaisDto> Pessoas { get; set; } = new List<PessoaTotaisDto>();
        public decimal TotalReceitasGeral { get; set; }
        public decimal TotalDespesasGeral { get; set; }
        public decimal SaldoLiquidoGeral { get; set; }
    }
}
